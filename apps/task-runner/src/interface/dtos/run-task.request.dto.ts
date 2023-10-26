import { AggregateID } from 'libs/ddd/entity.base';

export class RunTaskRequestDto {
  scheduledTaskId: AggregateID;
  protocol: string;
  host: string;
  port: number;
  payload: string;
}
