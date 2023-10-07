import { Command, CommandProps } from 'libs/ddd/command.base';

export class DeleteUserCommand extends Command {
  readonly id: string;

  private constructor(props: CommandProps<DeleteUserCommand>) {
    super(props);
    this.id = props.id;
  }

  static create(props: CommandProps<DeleteUserCommand>): DeleteUserCommand {
    return new DeleteUserCommand(props);
  }
}
