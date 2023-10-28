import { ResponseBase } from 'libs/dto/response.base';
import { UserResponseDto } from '../user/user.response.dto';

export class NotificationIntegrationResponseDto extends ResponseBase {
  name: string;
  type: string;
  url: string;
  token: string;
  active: boolean;
  owner: UserResponseDto;
}
