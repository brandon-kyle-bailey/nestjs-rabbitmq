import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteNotificationIntegrationCommand } from 'apps/gateway/src/interface/commands/notification-integration/delete-notification-integration.command';
import { AggregateID } from 'libs/ddd/entity.base';
import { NotificationIntegrationRepository } from '../../ports/notification-integration/notification-integration.repository';
import { NotificationIntegrationRepositoryPort } from '../../ports/notification-integration/notification-integration.repository.port';

@CommandHandler(DeleteNotificationIntegrationCommand)
export class DeleteNotificationIntegrationService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(NotificationIntegrationRepository)
    protected readonly repo: NotificationIntegrationRepositoryPort,
  ) {}
  async execute(
    command: DeleteNotificationIntegrationCommand,
  ): Promise<AggregateID> {
    try {
      await this.repo.transaction(async () => {
        const NotificationIntegration = await this.repo.findOneById(command.id);
        if (!NotificationIntegration.isOwner(command.userId)) {
          throw new UnauthorizedException(
            'user does not have permission to delete this resource',
          );
        }
        NotificationIntegration.delete();
        await this.repo.delete(NotificationIntegration);
      });
      return command.id;
    } catch (error) {
      this.logger.error(
        'DeleteNotificationIntegrationService.execute encountered an error',
        error,
      );
    }
  }
}
