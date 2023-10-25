import { Command, CommandProps } from 'libs/ddd/command.base';

export class PauseScheduleCommand extends Command {
  readonly operationId: string;

  private constructor(props: CommandProps<PauseScheduleCommand>) {
    super(props);
    this.operationId = props.operationId;
  }

  static create(
    props: CommandProps<PauseScheduleCommand>,
  ): PauseScheduleCommand {
    return new PauseScheduleCommand(props);
  }
}
