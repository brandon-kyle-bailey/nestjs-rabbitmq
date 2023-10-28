import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class CreateScheduledTaskIncidentNotificationCommand extends Command {
  readonly ownerId: AggregateID;
  readonly notify: boolean;
  readonly statusPrefix: number;
  readonly scheduledTaskId: AggregateID;
  readonly notificationIntegrationId: AggregateID;

  private constructor(
    props: CommandProps<CreateScheduledTaskIncidentNotificationCommand>,
  ) {
    super(props);
    this.ownerId = props.ownerId;
    this.notify = props.notify;
    this.statusPrefix = props.statusPrefix;
    this.scheduledTaskId = props.scheduledTaskId;
    this.notificationIntegrationId = props.notificationIntegrationId;
  }

  static create(
    props: CommandProps<CreateScheduledTaskIncidentNotificationCommand>,
  ): CreateScheduledTaskIncidentNotificationCommand {
    return new CreateScheduledTaskIncidentNotificationCommand(props);
  }
}
