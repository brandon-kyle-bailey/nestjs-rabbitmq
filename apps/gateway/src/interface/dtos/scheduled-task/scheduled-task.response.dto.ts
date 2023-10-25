import { ResponseBase } from 'libs/dto/response.base';

export class ScheduledTaskResponseDto extends ResponseBase {
  name: string;
  protocol: string;
  host: string;
  port: number;
  interval: number;
  type: string;
  active: boolean;
  payload: string;
}
