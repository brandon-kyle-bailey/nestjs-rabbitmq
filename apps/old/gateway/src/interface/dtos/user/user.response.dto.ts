import { ResponseBase } from 'libs/dto/response.base';

export class UserResponseDto extends ResponseBase {
  name: string;
  email: string;
  access_token?: string;
}
