import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateScheduledTaskIncidentNotificationCommand } from 'apps/gateway/src/interface/commands/scheduled-task-incident-notification/update-scheduled-task-incident-notification.command';
import { ScheduledTaskIncidentNotificationEntity } from '../../../domain/entities/scheduled-task-incident-notification.entity';
import { ScheduledTaskIncidentNotificationRepository } from '../../ports/scheduled-task-incident-notification/scheduled-task-incident-notification.repository';
import { ScheduledTaskIncidentNotificationRepositoryPort } from '../../ports/scheduled-task-incident-notification/scheduled-task-incident-notification.repository.port';

@CommandHandler(UpdateScheduledTaskIncidentNotificationCommand)
export class UpdateScheduledTaskIncidentNotificationService
  implements ICommandHandler
{
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduledTaskIncidentNotificationRepository)
    protected readonly repo: ScheduledTaskIncidentNotificationRepositoryPort,
  ) {}
  async execute(
    command: UpdateScheduledTaskIncidentNotificationCommand,
  ): Promise<ScheduledTaskIncidentNotificationEntity> {
    try {
      let scheduledTaskIncidentNotification: ScheduledTaskIncidentNotificationEntity;
      await this.repo.transaction(async () => {
        scheduledTaskIncidentNotification = await this.repo.findOneById(
          command.id,
        );
        if (!scheduledTaskIncidentNotification.isOwner(command.userId)) {
          throw new UnauthorizedException(
            'user does not have permission to update resource',
          );
        }
        scheduledTaskIncidentNotification.update({});
        this.repo.save(scheduledTaskIncidentNotification);
      });
      return scheduledTaskIncidentNotification;
    } catch (error) {
      this.logger.error(
        'UpdateScheduledTaskIncidentNotificationService.execute encountered an error',
        error,
      );
    }
  }
}
