export class CreateScheduledTaskRequestDto {
  readonly workspaceId: string;
  readonly name: string;
  readonly protocol: string;
  readonly host: string;
  readonly port: number;
  readonly interval: number;
  readonly type: string;
  readonly active: boolean;
  readonly payload: string;
}
