import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class CreateDefaultScheduledTaskIncidentNotificationCommand extends Command {
  readonly ownerId: AggregateID;
  readonly notify: boolean;
  readonly statusPrefix: number;
  readonly scheduledTaskId: AggregateID;

  private constructor(
    props: CommandProps<CreateDefaultScheduledTaskIncidentNotificationCommand>,
  ) {
    super(props);
    this.ownerId = props.ownerId;
    this.notify = props.notify;
    this.statusPrefix = props.statusPrefix;
    this.scheduledTaskId = props.scheduledTaskId;
  }

  static create(
    props: CommandProps<CreateDefaultScheduledTaskIncidentNotificationCommand>,
  ): CreateDefaultScheduledTaskIncidentNotificationCommand {
    return new CreateDefaultScheduledTaskIncidentNotificationCommand(props);
  }
}
