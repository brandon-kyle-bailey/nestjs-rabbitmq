import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class UpdateUserCommand extends Command {
  readonly id: AggregateID;
  readonly name?: string;
  readonly email?: string;
  readonly password?: string;

  private constructor(props: CommandProps<UpdateUserCommand>) {
    super(props);
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
  }

  static create(props: CommandProps<UpdateUserCommand>): UpdateUserCommand {
    return new UpdateUserCommand(props);
  }
}
