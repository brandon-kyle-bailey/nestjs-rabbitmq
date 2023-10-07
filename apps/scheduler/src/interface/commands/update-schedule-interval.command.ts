import { Command, CommandProps } from 'libs/ddd/command.base';

export class UpdateScheduleIntervalCommand extends Command {
  readonly operationId: string;
  readonly interval: number;

  private constructor(props: CommandProps<UpdateScheduleIntervalCommand>) {
    super(props);
    this.operationId = props.operationId;
    this.interval = props.interval;
  }

  static create(
    props: CommandProps<UpdateScheduleIntervalCommand>,
  ): UpdateScheduleIntervalCommand {
    return new UpdateScheduleIntervalCommand(props);
  }
}
