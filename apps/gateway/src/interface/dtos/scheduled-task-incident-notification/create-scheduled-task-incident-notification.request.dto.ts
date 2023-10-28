import { AggregateID } from 'libs/ddd/entity.base';

export class CreateScheduledTaskIncidentNotificationRequestDto {
  readonly notify: boolean;
  readonly statusPrefix: number;
  readonly scheduledTaskId: AggregateID;
  readonly notificationIntegrationId: AggregateID;
}
