import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class CreateNotificationIntegrationCommand extends Command {
  readonly ownerId: AggregateID;
  readonly name: string;
  readonly type: string;
  readonly url: string;
  readonly token: string;
  readonly active: boolean;

  private constructor(
    props: CommandProps<CreateNotificationIntegrationCommand>,
  ) {
    super(props);
    this.name = props.name;
    this.ownerId = props.ownerId;
    this.type = props.type;
    this.url = props.url;
    this.token = props.token;
    this.active = props.active;
  }

  static create(
    props: CommandProps<CreateNotificationIntegrationCommand>,
  ): CreateNotificationIntegrationCommand {
    return new CreateNotificationIntegrationCommand(props);
  }
}
