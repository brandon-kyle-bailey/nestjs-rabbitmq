import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class UpdateOperationCommand extends Command {
  readonly id: AggregateID;
  readonly name?: string;
  readonly protocol?: string;
  readonly host?: string;
  readonly port?: number;
  readonly interval?: number;

  private constructor(props: CommandProps<UpdateOperationCommand>) {
    super(props);
    this.id = props.id;
    this.name = props.name;
    this.protocol = props.protocol;
    this.host = props.host;
    this.port = props.port;
    this.interval = props.interval;
  }

  static create(
    props: CommandProps<UpdateOperationCommand>,
  ): UpdateOperationCommand {
    return new UpdateOperationCommand(props);
  }
}
