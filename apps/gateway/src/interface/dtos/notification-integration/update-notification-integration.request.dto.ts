export class UpdateNotificationIntegrationRequestDto {
  readonly id: string;
  readonly name?: string;
  readonly active?: boolean;
  readonly url?: string;
  readonly token?: string;
}
