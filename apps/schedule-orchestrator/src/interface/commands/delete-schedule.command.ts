import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class DeleteScheduleCommand extends Command {
  readonly scheduledTaskId: AggregateID;

  private constructor(props: CommandProps<DeleteScheduleCommand>) {
    super(props);
    this.scheduledTaskId = props.scheduledTaskId;
  }

  static create(
    props: CommandProps<DeleteScheduleCommand>,
  ): DeleteScheduleCommand {
    return new DeleteScheduleCommand(props);
  }
}
