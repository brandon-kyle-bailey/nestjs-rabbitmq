import { Command, CommandProps } from 'libs/ddd/command.base';

export class UpdateOperationIntervalCommand extends Command {
  readonly id: string;
  readonly interval: number;

  private constructor(props: CommandProps<UpdateOperationIntervalCommand>) {
    super(props);
    this.id = props.id;
    this.interval = props.interval;
  }

  static create(
    props: CommandProps<UpdateOperationIntervalCommand>,
  ): UpdateOperationIntervalCommand {
    return new UpdateOperationIntervalCommand(props);
  }
}
