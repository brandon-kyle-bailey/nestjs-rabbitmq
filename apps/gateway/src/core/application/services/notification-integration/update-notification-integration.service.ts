import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateNotificationIntegrationCommand } from 'apps/gateway/src/interface/commands/notification-integration/update-notification-integration.command';
import { NotificationIntegrationEntity } from '../../../domain/entities/notification-integration.entity';
import { NotificationIntegrationRepository } from '../../ports/notification-integration/notification-integration.repository';
import { NotificationIntegrationRepositoryPort } from '../../ports/notification-integration/notification-integration.repository.port';

@CommandHandler(UpdateNotificationIntegrationCommand)
export class UpdateNotificationIntegrationService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(NotificationIntegrationRepository)
    protected readonly repo: NotificationIntegrationRepositoryPort,
  ) {}
  async execute(
    command: UpdateNotificationIntegrationCommand,
  ): Promise<NotificationIntegrationEntity> {
    try {
      let notificationIntegration: NotificationIntegrationEntity;
      await this.repo.transaction(async () => {
        notificationIntegration = await this.repo.findOneById(command.id);
        if (!notificationIntegration.isOwner(command.userId)) {
          throw new UnauthorizedException(
            'user does not have permission to update resource',
          );
        }
        notificationIntegration.update({
          name: command.name,
          active: command.active,
          url: command.url,
          token: command.token,
        });
        this.repo.save(notificationIntegration);
      });
      return notificationIntegration;
    } catch (error) {
      this.logger.error(
        'UpdateNotificationIntegrationService.execute encountered an error',
        error,
      );
    }
  }
}
