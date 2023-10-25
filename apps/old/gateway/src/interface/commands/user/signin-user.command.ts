import { Command, CommandProps } from 'libs/ddd/command.base';

export class SigninUserCommand extends Command {
  readonly email: string;
  readonly password: string;

  private constructor(props: CommandProps<SigninUserCommand>) {
    super(props);
    this.email = props.email;
    this.password = props.password;
  }

  static create(props: CommandProps<SigninUserCommand>): SigninUserCommand {
    return new SigninUserCommand(props);
  }
}
