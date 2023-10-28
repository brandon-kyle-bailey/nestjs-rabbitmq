import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class UpdateNotificationIntegrationCommand extends Command {
  readonly id: AggregateID;
  readonly userId: AggregateID;
  readonly name?: string;
  readonly active?: boolean;
  readonly url?: string;
  readonly token?: string;

  private constructor(
    props: CommandProps<UpdateNotificationIntegrationCommand>,
  ) {
    super(props);
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.active = props.active;
    this.url = props.url;
    this.token = props.token;
  }

  static create(
    props: CommandProps<UpdateNotificationIntegrationCommand>,
  ): UpdateNotificationIntegrationCommand {
    return new UpdateNotificationIntegrationCommand(props);
  }
}
