import { AggregateID } from 'libs/ddd/entity.base';

export class ScheduleResponseDto {
  scheduledTaskId: AggregateID;
  ownerId: AggregateID;
  workspaceId: AggregateID;
  name: string;
  protocol: string;
  host: string;
  port: number;
  interval: number;
  type: string;
  active: boolean;
  payload: string;
}
