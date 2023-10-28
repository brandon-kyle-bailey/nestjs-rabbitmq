export class FindAllByScheduledTaskIdNotifyStatusPrefixRequestDto {
  readonly scheduledTaskId: string;
  readonly notify: boolean;
  readonly statusPrefix: number;
}
