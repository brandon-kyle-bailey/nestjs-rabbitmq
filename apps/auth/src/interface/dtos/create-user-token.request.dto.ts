import { RolesEnum } from 'libs/common/enum/roles.enum';

export class CreateUserTokenRequestDto {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: RolesEnum;
}
