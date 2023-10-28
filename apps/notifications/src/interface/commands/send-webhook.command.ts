import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class SendWebhookCommand extends Command {
  readonly name: string;
  readonly token: string;
  readonly url: string;

  private constructor(props: CommandProps<SendWebhookCommand>) {
    super(props);
    this.name = props.name;
    this.token = props.token;
    this.url = props.url;
  }

  static create(props: CommandProps<SendWebhookCommand>): SendWebhookCommand {
    return new SendWebhookCommand(props);
  }
}
