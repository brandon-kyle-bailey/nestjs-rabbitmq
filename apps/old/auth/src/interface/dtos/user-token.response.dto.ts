import { ResponseBase } from 'libs/dto/response.base';

export class UserTokenResponseDto extends ResponseBase {
  access_token: string;
}
