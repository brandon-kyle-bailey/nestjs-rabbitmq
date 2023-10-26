import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class CreateScheduleCommand extends Command {
  readonly scheduledTaskId: AggregateID;
  readonly protocol: string;
  readonly host: string;
  readonly port: number;
  readonly interval: number;
  readonly type: string;
  readonly active: boolean;
  readonly payload: string;

  private constructor(props: CommandProps<CreateScheduleCommand>) {
    super(props);
    this.scheduledTaskId = props.scheduledTaskId;
    this.protocol = props.protocol;
    this.host = props.host;
    this.port = props.port;
    this.interval = props.interval;
    this.type = props.type;
    this.active = props.active;
    this.payload = props.payload;
  }

  static create(
    props: CommandProps<CreateScheduleCommand>,
  ): CreateScheduleCommand {
    return new CreateScheduleCommand(props);
  }
}
