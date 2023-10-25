import { Command, CommandProps } from 'libs/ddd/command.base';

export class CreateUserTokenCommand extends Command {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;

  private constructor(props: CommandProps<CreateUserTokenCommand>) {
    super(props);
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
  }

  static create(
    props: CommandProps<CreateUserTokenCommand>,
  ): CreateUserTokenCommand {
    return new CreateUserTokenCommand(props);
  }
}
