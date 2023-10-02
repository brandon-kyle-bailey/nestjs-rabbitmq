import { ResponseBase } from 'libs/dto/response.base';

export class ScheduleResponseDto extends ResponseBase {
  operationId: string;
  type: string;
  interval: number;
  active: boolean;
}
