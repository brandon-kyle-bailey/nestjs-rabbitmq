import { Command, CommandProps } from 'libs/ddd/command.base';

export class RefreshUserTokenCommand extends Command {
  readonly refresh_token: string;

  private constructor(props: CommandProps<RefreshUserTokenCommand>) {
    super(props);
    this.refresh_token = props.refresh_token;
  }

  static create(
    props: CommandProps<RefreshUserTokenCommand>,
  ): RefreshUserTokenCommand {
    return new RefreshUserTokenCommand(props);
  }
}
