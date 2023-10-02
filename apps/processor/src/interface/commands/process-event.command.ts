import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class ProcessEventCommand extends Command {
  readonly operationId: AggregateID;

  private constructor(props: CommandProps<ProcessEventCommand>) {
    super(props);
    this.operationId = props.operationId;
  }

  static create(props: CommandProps<ProcessEventCommand>): ProcessEventCommand {
    return new ProcessEventCommand(props);
  }
}
