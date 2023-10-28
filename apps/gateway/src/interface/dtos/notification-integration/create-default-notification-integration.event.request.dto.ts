import { AggregateID } from 'libs/ddd/entity.base';

export class CreateDefaultNotificationIntegrationEventRequestDto {
  readonly userId: AggregateID;
  readonly workspaceId: AggregateID;
  readonly receiveDefaultNotifications: boolean;
}
