import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { UserIntegrationEvents } from 'libs/events/user.events';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly logger: Logger,
    @Inject(TransportAdapterNames.TransportAuthAdapterService)
    private readonly service: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.service.connect();
  }
  async onModuleDestroy() {
    await this.service.close();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.debug('AuthGuad.canActivate called with', context);
    const request = context.switchToHttp().getRequest();
    this.logger.debug('request', request);
    const token = this.extractTokenFromHeader(request);
    this.logger.debug('token', token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await firstValueFrom(
        this.service.send(UserIntegrationEvents.VerifyToken, {
          access_token: token,
        }),
      );
      this.logger.debug('payload', payload);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
