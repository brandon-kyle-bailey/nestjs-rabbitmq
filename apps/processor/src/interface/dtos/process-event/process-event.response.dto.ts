import { ResponseBase } from 'libs/dto/response.base';

export class ProcessEventResponseDto extends ResponseBase {
  operationId: string;
  status: number;
  duration: number;
}
