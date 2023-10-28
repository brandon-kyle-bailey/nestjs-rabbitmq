import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';
import { ScheduledTaskIncidentNotificationEntity } from '../../../domain/entities/scheduled-task-incident-notification.entity';
import { ScheduledTaskIncidentNotificationRepository } from '../../ports/scheduled-task-incident-notification/scheduled-task-incident-notification.repository';
import { ScheduledTaskIncidentNotificationRepositoryPort } from '../../ports/scheduled-task-incident-notification/scheduled-task-incident-notification.repository.port';
import { ScheduledTaskRepository } from '../../ports/scheduled-task/scheduled-task.repository';
import { ScheduledTaskRepositoryPort } from '../../ports/scheduled-task/scheduled-task.repository.port';
import { NotificationIntegrationRepository } from '../../ports/notification-integration/notification-integration.repository';
import { NotificationIntegrationRepositoryPort } from '../../ports/notification-integration/notification-integration.repository.port';
import { CreateDefaultScheduledTaskIncidentNotificationCommand } from 'apps/gateway/src/interface/commands/scheduled-task-incident-notification/create-default-scheduled-task-incident-notification.command';

@CommandHandler(CreateDefaultScheduledTaskIncidentNotificationCommand)
export class CreateDefaultScheduledTaskIncidentNotificationService
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
    command: CreateDefaultScheduledTaskIncidentNotificationCommand,
  ): Promise<ScheduledTaskIncidentNotificationEntity> {
    try {
      this.logger.debug(
        'CreateDefaultScheduledTaskIncidentNotificationService invoked with payload',
        JSON.stringify(command),
      );
      const owner = await this.userRepo.findOneById(command.ownerId);
      const scheduledTask = await this.scheduledTaskRepo.findOneById(
        command.scheduledTaskId,
      );
      const notificationIntegration =
        await this.notificationIntegrationRepo.findOneByName(
          'default',
          command.ownerId,
        );
      const scheduledTaskIncidentNotification =
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
      scheduledTaskIncidentNotification.clearEvents();
      await this.repo.transaction(async () => {
        this.repo.insert(scheduledTaskIncidentNotification);
      });
      return scheduledTaskIncidentNotification;
    } catch (error) {
      this.logger.error(
        'CreateDefaultScheduledTaskIncidentNotificationService.execute encountered an error',
        error,
      );
    }
  }
}
