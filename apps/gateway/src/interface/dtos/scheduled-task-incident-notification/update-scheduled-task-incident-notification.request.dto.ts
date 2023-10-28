import { AggregateID } from 'libs/ddd/entity.base';

export class UpdateScheduledTaskIncidentNotificationRequestDto {
  readonly id: string;
  readonly notify?: boolean;
  readonly statusPrefix?: number;
  readonly scheduledTaskId?: AggregateID;
  readonly notificationIntegrationId?: AggregateID;
}
