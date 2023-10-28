import { AggregateID } from 'libs/ddd/entity.base';

export class TaskRunnerCompleteEventDto {
  readonly scheduledTaskId: AggregateID;
  readonly status: number;
  readonly duration: number;
  readonly response: string;
  readonly createdAt: Date;
}
