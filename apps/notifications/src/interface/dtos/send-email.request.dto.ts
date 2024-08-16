export class SendEmailRequestDto {
  readonly id: string;
  readonly to: string;
  readonly subject: string;
  readonly text: string;
}
