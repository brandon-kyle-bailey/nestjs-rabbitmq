import { ResponseBase } from 'libs/dto/response.base';

export class UserTokenPayloadResponseDto extends ResponseBase {
  sub: string;
  username: string;
  email: string;
  role: string;
}
