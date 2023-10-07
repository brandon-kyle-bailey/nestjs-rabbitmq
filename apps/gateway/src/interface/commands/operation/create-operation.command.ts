import { Command, CommandProps } from 'libs/ddd/command.base';

export class CreateOperationCommand extends Command {
  readonly name: string;
  readonly protocol: string;
  readonly host: string;
  readonly port: number;
  readonly interval: number;

  private constructor(props: CommandProps<CreateOperationCommand>) {
    super(props);
    this.name = props.name;
    this.protocol = props.protocol;
    this.host = props.host;
    this.port = props.port;
    this.interval = props.interval;
  }

  static create(
    props: CommandProps<CreateOperationCommand>,
  ): CreateOperationCommand {
    return new CreateOperationCommand(props);
  }
}
