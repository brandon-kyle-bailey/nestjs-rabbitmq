import { AggregateID } from 'libs/ddd/entity.base';

export class DeleteScheduleRequestDto {
  readonly scheduledTaskId: AggregateID;
}
