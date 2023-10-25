import { Command, CommandProps } from 'libs/ddd/command.base';

export class VerifyUserTokenCommand extends Command {
  readonly access_token: string;

  private constructor(props: CommandProps<VerifyUserTokenCommand>) {
    super(props);
    this.access_token = props.access_token;
  }

  static create(
    props: CommandProps<VerifyUserTokenCommand>,
  ): VerifyUserTokenCommand {
    return new VerifyUserTokenCommand(props);
  }
}
