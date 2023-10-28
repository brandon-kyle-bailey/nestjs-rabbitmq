import { RepositoryPort } from 'libs/ports/repository.port';
import { NotificationIntegrationEntity } from '../../../domain/entities/notification-integration.entity';
import { ScheduledTaskIncidentNotificationEntity } from '../../../domain/entities/scheduled-task-incident-notification.entity';

export interface ScheduledTaskIncidentNotificationRepositoryPort
  extends RepositoryPort<ScheduledTaskIncidentNotificationEntity> {
  findAllByScheduledTaskIdAndStatusPrefix(
    scheduledTaskId: string,
    statusPrefix: number,
  ): Promise<ScheduledTaskIncidentNotificationEntity[]>;
}
