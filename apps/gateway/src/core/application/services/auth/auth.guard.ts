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
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await firstValueFrom(
        this.service.send(UserIntegrationEvents.VerifyToken, {
          access_token: token,
        }),
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = payload;
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
