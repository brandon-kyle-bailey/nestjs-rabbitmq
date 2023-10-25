import { ResponseBase } from 'libs/dto/response.base';

export class OperationResponseDto extends ResponseBase {
  name: string;
  protocol: string;
  host: string;
  port: number;
}
