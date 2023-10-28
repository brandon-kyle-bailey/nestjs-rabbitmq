import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNotificationIntegrationCommand } from 'apps/gateway/src/interface/commands/notification-integration/create-notification-integration.command';
import { NotificationIntegrationEntity } from '../../../domain/entities/notification-integration.entity';
import { NotificationIntegrationRepository } from '../../ports/notification-integration/notification-integration.repository';
import { NotificationIntegrationRepositoryPort } from '../../ports/notification-integration/notification-integration.repository.port';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';

@CommandHandler(CreateNotificationIntegrationCommand)
export class CreateNotificationIntegrationService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(NotificationIntegrationRepository)
    protected readonly repo: NotificationIntegrationRepositoryPort,
    @Inject(UserRepository)
    protected readonly userRepo: UserRepositoryPort,
  ) {}
  async execute(
    command: CreateNotificationIntegrationCommand,
  ): Promise<NotificationIntegrationEntity> {
    try {
      this.logger.debug('command', JSON.stringify(command));
      const owner = await this.userRepo.findOneById(command.ownerId);
      const notificationIntegration = NotificationIntegrationEntity.create({
        name: command.name,
        owner,
        type: command.type,
        url: command.url,
        token: command.token,
        active: command.active,
      });
      await this.repo.transaction(async () => {
        this.repo.insert(notificationIntegration);
      });
      return notificationIntegration;
    } catch (error) {
      this.logger.error(
        'CreateNotificationIntegrationService.execute encountered an error',
        error,
      );
    }
  }
}
