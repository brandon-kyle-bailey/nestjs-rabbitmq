import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class UpdateUserCommand extends Command {
  readonly userId: AggregateID;
  readonly name?: string;
  readonly email?: string;
  readonly password?: string;
  readonly verified?: boolean;

  private constructor(props: CommandProps<UpdateUserCommand>) {
    super(props);
    this.userId = props.userId;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.verified = props.verified;
  }

  static create(props: CommandProps<UpdateUserCommand>): UpdateUserCommand {
    return new UpdateUserCommand(props);
  }
}
