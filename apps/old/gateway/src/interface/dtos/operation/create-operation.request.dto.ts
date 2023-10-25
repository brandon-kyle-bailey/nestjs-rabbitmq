export class CreateOperationRequestDto {
  readonly name: string;
  readonly protocol: string;
  readonly host: string;
  readonly port: number;
  readonly interval: number;
}
