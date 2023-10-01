import { ResponseBase } from 'libs/dto/response.base';

export class ScheduleResponseDto extends ResponseBase {
  name: string;
  protocol: string;
  host: string;
  port: number;
  interval: number;
}
