export class CreateNotificationIntegrationRequestDto {
  readonly name: string;
  readonly type: string;
  readonly url: string;
  readonly token: string;
  readonly active: boolean;
}
