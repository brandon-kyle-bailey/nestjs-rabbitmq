import {
  Inject,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';
import { SigninUserCommand } from 'apps/gateway/src/interface/commands/user/signin-user.command';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserIntegrationEvents } from 'libs/events/user.events';

@CommandHandler(SigninUserCommand)
export class SigninUserService
  implements ICommandHandler, OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly logger: Logger,
    @Inject(UserRepository)
    private readonly repo: UserRepositoryPort,
    @Inject(TransportAdapterNames.TransportAuthAdapterService)
    private readonly service: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.service.connect();
  }
  async onModuleDestroy() {
    await this.service.close();
  }
  async execute(command: SigninUserCommand): Promise<UserEntity> {
    try {
      this.logger.debug(
        `SigninUserService.execute called with command`,
        command,
      );
      const user = await this.repo.findOneByEmail(command.email);
      if (!user) {
        this.logger.debug('no user found, returning');
        throw new NotFoundException('user not found');
      }
      this.logger.debug('found user', user);
      const { id, name, email, password } = user.getProps();
      if (!user.verifyPasswordHash(command.password)) {
        this.logger.debug('credentials invalid');
        throw new UnauthorizedException('credentials invalid');
      }
      const payload = {
        id,
        name,
        email,
        password,
      };
      this.logger.debug('payload', payload);
      const token = await firstValueFrom(
        this.service.send(UserIntegrationEvents.CreateToken, payload),
      );
      this.logger.debug('token', token);
      return UserEntity.create(
        { ...user.getProps(), access_token: token.access_token },
        user.id,
      );
    } catch (error) {
      this.logger.error(
        'SigninUserService.execute encountered an error',
        error,
      );
    }
  }
}
