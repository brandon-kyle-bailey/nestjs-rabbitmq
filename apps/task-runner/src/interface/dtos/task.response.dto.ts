import { AggregateID } from 'libs/ddd/entity.base';

export class TaskResponseDto {
  scheduledTaskId: AggregateID;
  status: number;
  duration: number;
  response: string;
}
