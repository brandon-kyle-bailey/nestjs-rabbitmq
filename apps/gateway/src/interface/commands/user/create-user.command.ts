import { BillingPlanNamesEnum } from 'libs/common/enum/billing-plan-names.enum';
import { RolesEnum } from 'libs/common/enum/roles.enum';
import { Command, CommandProps } from 'libs/ddd/command.base';

export class CreateUserCommand extends Command {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: RolesEnum;
  readonly billingPlanName: BillingPlanNamesEnum;

  private constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
    this.billingPlanName = props.billingPlanName;
  }

  static create(props: CommandProps<CreateUserCommand>): CreateUserCommand {
    return new CreateUserCommand(props);
  }
}
