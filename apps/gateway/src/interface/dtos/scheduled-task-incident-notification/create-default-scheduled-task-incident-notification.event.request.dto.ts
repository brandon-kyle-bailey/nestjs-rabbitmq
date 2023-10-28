import { AggregateID } from 'libs/ddd/entity.base';

export class CreateDefaultScheduledTaskIncidentNotificationEventRequestDto {
  readonly notify: boolean;
  readonly statusPrefix: number;
  readonly scheduledTaskId: AggregateID;
  readonly ownerId: AggregateID;
}
