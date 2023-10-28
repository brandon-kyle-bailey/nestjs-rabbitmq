import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteScheduledTaskIncidentNotificationCommand } from 'apps/gateway/src/interface/commands/scheduled-task-incident-notification/delete-scheduled-task-incident-notification.command';
import { AggregateID } from 'libs/ddd/entity.base';
import { ScheduledTaskIncidentNotificationRepository } from '../../ports/scheduled-task-incident-notification/scheduled-task-incident-notification.repository';
import { ScheduledTaskIncidentNotificationRepositoryPort } from '../../ports/scheduled-task-incident-notification/scheduled-task-incident-notification.repository.port';

@CommandHandler(DeleteScheduledTaskIncidentNotificationCommand)
export class DeleteScheduledTaskIncidentNotificationService
  implements ICommandHandler
{
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduledTaskIncidentNotificationRepository)
    protected readonly repo: ScheduledTaskIncidentNotificationRepositoryPort,
  ) {}
  async execute(
    command: DeleteScheduledTaskIncidentNotificationCommand,
  ): Promise<AggregateID> {
    try {
      await this.repo.transaction(async () => {
        const ScheduledTaskIncidentNotification = await this.repo.findOneById(
          command.id,
        );
        if (!ScheduledTaskIncidentNotification.isOwner(command.userId)) {
          throw new UnauthorizedException(
            'user does not have permission to delete this resource',
          );
        }
        ScheduledTaskIncidentNotification.delete();
        await this.repo.delete(ScheduledTaskIncidentNotification);
      });
      return command.id;
    } catch (error) {
      this.logger.error(
        'DeleteScheduledTaskIncidentNotificationService.execute encountered an error',
        error,
      );
    }
  }
}
