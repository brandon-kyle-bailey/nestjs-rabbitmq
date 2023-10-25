import { BillingPlanNamesEnum } from 'libs/common/enum/billing-plan-names.enum';
import { RolesEnum } from 'libs/common/enum/roles.enum';

export class CreateUserRequestDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: RolesEnum;
  readonly billingPlanName: BillingPlanNamesEnum;
}
