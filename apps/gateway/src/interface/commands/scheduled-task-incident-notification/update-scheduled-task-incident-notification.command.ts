import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class UpdateScheduledTaskIncidentNotificationCommand extends Command {
  readonly id: AggregateID;
  readonly userId: AggregateID;
  readonly notify?: boolean;
  readonly statusPrefix?: number;
  readonly scheduledTaskId?: AggregateID;
  readonly notificationIntegrationId?: AggregateID;

  private constructor(
    props: CommandProps<UpdateScheduledTaskIncidentNotificationCommand>,
  ) {
    super(props);
    this.id = props.id;
    this.userId = props.userId;
    this.notify = props.notify;
    this.statusPrefix = props.statusPrefix;
    this.scheduledTaskId = props.scheduledTaskId;
    this.notificationIntegrationId = props.notificationIntegrationId;
  }

  static create(
    props: CommandProps<UpdateScheduledTaskIncidentNotificationCommand>,
  ): UpdateScheduledTaskIncidentNotificationCommand {
    return new UpdateScheduledTaskIncidentNotificationCommand(props);
  }
}
