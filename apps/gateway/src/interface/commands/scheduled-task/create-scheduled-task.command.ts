import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class CreateScheduledTaskCommand extends Command {
  readonly ownerId: AggregateID;
  readonly workspaceId: AggregateID;
  readonly name: string;
  readonly protocol: string;
  readonly host: string;
  readonly port: number;
  readonly interval: number;
  readonly type: string;
  readonly active: boolean;
  readonly payload: string;

  private constructor(props: CommandProps<CreateScheduledTaskCommand>) {
    super(props);
    this.ownerId = props.ownerId;
    this.workspaceId = props.workspaceId;
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
    props: CommandProps<CreateScheduledTaskCommand>,
  ): CreateScheduledTaskCommand {
    return new CreateScheduledTaskCommand(props);
  }
}
