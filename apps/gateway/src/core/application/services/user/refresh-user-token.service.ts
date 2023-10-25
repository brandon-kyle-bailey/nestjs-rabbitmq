import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UserIntegrationEvents } from 'libs/events/user.events';
import { RefreshUserTokenCommand } from 'apps/gateway/src/interface/commands/user/refresh-user-token.command';

@CommandHandler(RefreshUserTokenCommand)
export class RefresUserTokenService
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
  async execute(command: RefreshUserTokenCommand): Promise<UserEntity> {
    try {
      this.logger.debug(
        `RefresUserTokenService.execute called with command`,
        command,
      );
      const token = await lastValueFrom(
        this.service.send(UserIntegrationEvents.RefreshToken, {
          refresh_token: command.refresh_token,
        }),
      );
      const userContext = await lastValueFrom(
        this.service.send(UserIntegrationEvents.VerifyToken, {
          access_token: command.refresh_token,
        }),
      );
      const user = await this.repo.findOneById(userContext.sub);
      return UserEntity.create(
        {
          ...user.getProps(),
          access_token: token.access_token,
          refresh_token: token.refresh_token,
        },
        user.id,
      );
    } catch (error) {
      this.logger.error(
        'RefresUserTokenService.execute encountered an error',
        error,
      );
    }
  }
}
