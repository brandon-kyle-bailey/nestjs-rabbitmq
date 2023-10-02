export class UpdateOperationRequestDto {
  readonly id: string;
  readonly name?: string;
  readonly protocol?: string;
  readonly host?: string;
  readonly port?: number;
}
