import { ResponseBase } from 'libs/dto/response.base';

export class NotificationIntegrationResponseDto extends ResponseBase {
  name: string;
  type: string;
  url: string;
  token: string;
  active: boolean;
}
