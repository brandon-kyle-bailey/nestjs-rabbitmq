import { Command, CommandProps } from 'libs/ddd/command.base';

export class SendVerificationEmailCommand extends Command {
  readonly name: string;
  readonly email: string;

  private constructor(props: CommandProps<SendVerificationEmailCommand>) {
    super(props);
    this.name = props.name;
    this.email = props.email;
  }

  static create(
    props: CommandProps<SendVerificationEmailCommand>,
  ): SendVerificationEmailCommand {
    return new SendVerificationEmailCommand(props);
  }
}
