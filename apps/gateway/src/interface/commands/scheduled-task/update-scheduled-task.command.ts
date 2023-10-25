import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class UpdateScheduledTaskCommand extends Command {
  readonly id: AggregateID;
  readonly name?: string;
  readonly protocol?: string;
  readonly host?: string;
  readonly port?: number;
  readonly interval?: number;
  readonly type?: string;
  readonly active?: boolean;
  readonly payload?: string;

  private constructor(props: CommandProps<UpdateScheduledTaskCommand>) {
    super(props);
    this.id = props.id;
    this.name = props.name;
    this.protocol = props.protocol;
    this.host = props.host;
    this.port = props.port;
    this.interval = props.interval;
    this.type = props.type;
    this.active = props.active;
    this.payload = props.payload;
  }

  static create(
    props: CommandProps<UpdateScheduledTaskCommand>,
  ): UpdateScheduledTaskCommand {
    return new UpdateScheduledTaskCommand(props);
  }
}
