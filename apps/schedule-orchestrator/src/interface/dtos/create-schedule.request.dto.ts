import { AggregateID } from 'libs/ddd/entity.base';

export class CreateScheduleRequestDto {
  readonly scheduledTaskId: AggregateID;
  readonly ownerId: AggregateID;
  readonly workspaceId: AggregateID;
  readonly name: string;
  readonly protocol: string;
  readonly host: string;
  readonly port: number;
  readonly interval: number;
  readonly type: string;
  readonly active: boolean;
  readonly payload: string;
}
