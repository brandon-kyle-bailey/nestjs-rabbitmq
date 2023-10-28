import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';
import { CreateScheduledTaskIncidentNotificationCommand } from 'apps/gateway/src/interface/commands/scheduled-task-incident-notification/create-scheduled-task-incident-notification.command';
import { ScheduledTaskIncidentNotificationEntity } from '../../../domain/entities/scheduled-task-incident-notification.entity';
import { ScheduledTaskIncidentNotificationRepository } from '../../ports/scheduled-task-incident-notification/scheduled-task-incident-notification.repository';
import { ScheduledTaskIncidentNotificationRepositoryPort } from '../../ports/scheduled-task-incident-notification/scheduled-task-incident-notification.repository.port';
import { ScheduledTaskRepository } from '../../ports/scheduled-task/scheduled-task.repository';
import { ScheduledTaskRepositoryPort } from '../../ports/scheduled-task/scheduled-task.repository.port';
import { NotificationIntegrationRepository } from '../../ports/notification-integration/notification-integration.repository';
import { NotificationIntegrationRepositoryPort } from '../../ports/notification-integration/notification-integration.repository.port';

@CommandHandler(CreateScheduledTaskIncidentNotificationCommand)
export class CreateScheduledTaskIncidentNotificationService
  implements ICommandHandler
{
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduledTaskIncidentNotificationRepository)
    protected readonly repo: ScheduledTaskIncidentNotificationRepositoryPort,
    @Inject(UserRepository)
    protected readonly userRepo: UserRepositoryPort,
    @Inject(ScheduledTaskRepository)
    protected readonly scheduledTaskRepo: ScheduledTaskRepositoryPort,
    @Inject(NotificationIntegrationRepository)
    protected readonly notificationIntegrationRepo: NotificationIntegrationRepositoryPort,
  ) {}
  async execute(
    command: CreateScheduledTaskIncidentNotificationCommand,
  ): Promise<ScheduledTaskIncidentNotificationEntity> {
    try {
      this.logger.debug('command', JSON.stringify(command));
      const owner = await this.userRepo.findOneById(command.ownerId);
      const scheduledTask = await this.scheduledTaskRepo.findOneById(
        command.scheduledTaskId,
      );
      const notificationIntegration =
        await this.notificationIntegrationRepo.findOneById(
          command.notificationIntegrationId,
        );
      const ScheduledTaskIncidentNotification =
        ScheduledTaskIncidentNotificationEntity.create({
          owner,
          statusPrefix: command.statusPrefix,
          ownerId: owner.id,
          notify: command.notify,
          scheduledTaskId: scheduledTask.id,
          scheduledTask,
          notificationIntegrationId: notificationIntegration.id,
          notificationIntegration,
        });
      await this.repo.transaction(async () => {
        this.repo.insert(ScheduledTaskIncidentNotification);
      });
      return ScheduledTaskIncidentNotification;
    } catch (error) {
      this.logger.error(
        'CreateScheduledTaskIncidentNotificationService.execute encountered an error',
        error,
      );
    }
  }
}
