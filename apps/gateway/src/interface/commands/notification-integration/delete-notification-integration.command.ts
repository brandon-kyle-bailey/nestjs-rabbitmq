import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class DeleteNotificationIntegrationCommand extends Command {
  readonly userId: AggregateID;
  readonly id: AggregateID;

  private constructor(
    props: CommandProps<DeleteNotificationIntegrationCommand>,
  ) {
    super(props);
    this.userId = props.userId;
    this.id = props.id;
  }

  static create(
    props: CommandProps<DeleteNotificationIntegrationCommand>,
  ): DeleteNotificationIntegrationCommand {
    return new DeleteNotificationIntegrationCommand(props);
  }
}
