import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class DeleteScheduledTaskIncidentNotificationCommand extends Command {
  readonly userId: AggregateID;
  readonly id: AggregateID;

  private constructor(
    props: CommandProps<DeleteScheduledTaskIncidentNotificationCommand>,
  ) {
    super(props);
    this.userId = props.userId;
    this.id = props.id;
  }

  static create(
    props: CommandProps<DeleteScheduledTaskIncidentNotificationCommand>,
  ): DeleteScheduledTaskIncidentNotificationCommand {
    return new DeleteScheduledTaskIncidentNotificationCommand(props);
  }
}
