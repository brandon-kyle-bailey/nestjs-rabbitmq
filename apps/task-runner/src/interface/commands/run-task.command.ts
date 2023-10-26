import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class RunTaskCommand extends Command {
  readonly scheduledTaskId: AggregateID;
  readonly protocol: string;
  readonly host: string;
  readonly port: number;
  readonly payload: string;

  private constructor(props: CommandProps<RunTaskCommand>) {
    super(props);
    this.scheduledTaskId = props.scheduledTaskId;
    this.protocol = props.protocol;
    this.host = props.host;
    this.port = props.port;
    this.payload = props.payload;
  }

  static create(props: CommandProps<RunTaskCommand>): RunTaskCommand {
    return new RunTaskCommand(props);
  }
}
