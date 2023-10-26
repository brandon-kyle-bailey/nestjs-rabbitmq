import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class DeleteScheduledTaskCommand extends Command {
  readonly id: AggregateID;
  readonly userId: AggregateID;

  private constructor(props: CommandProps<DeleteScheduledTaskCommand>) {
    super(props);
    this.id = props.id;
    this.userId = props.userId;
  }

  static create(
    props: CommandProps<DeleteScheduledTaskCommand>,
  ): DeleteScheduledTaskCommand {
    return new DeleteScheduledTaskCommand(props);
  }
}
