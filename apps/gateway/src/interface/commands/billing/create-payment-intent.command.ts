import { Command, CommandProps } from 'libs/ddd/command.base';

export class CreatePaymentIntentCommand extends Command {
  readonly amount: number;
  readonly currency: string;

  private constructor(props: CommandProps<CreatePaymentIntentCommand>) {
    super(props);
    this.amount = props.amount;
    this.currency = props.currency;
  }

  static create(
    props: CommandProps<CreatePaymentIntentCommand>,
  ): CreatePaymentIntentCommand {
    return new CreatePaymentIntentCommand(props);
  }
}
