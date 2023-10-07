import { Command, CommandProps } from 'libs/ddd/command.base';

export class PauseOperationCommand extends Command {
  readonly id: string;

  private constructor(props: CommandProps<PauseOperationCommand>) {
    super(props);
    this.id = props.id;
  }

  static create(
    props: CommandProps<PauseOperationCommand>,
  ): PauseOperationCommand {
    return new PauseOperationCommand(props);
  }
}
