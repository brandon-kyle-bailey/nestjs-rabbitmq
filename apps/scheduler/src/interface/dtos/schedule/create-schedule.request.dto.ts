export class CreateScheduleRequestDto {
  readonly operationId: string;
  readonly type: string;
  readonly interval: number;
  readonly active: boolean;
}
