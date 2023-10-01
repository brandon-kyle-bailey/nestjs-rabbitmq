import { Command, CommandProps } from 'libs/ddd/command.base';

export class DeleteOperationCommand extends Command {
  readonly id: string;

  private constructor(props: CommandProps<DeleteOperationCommand>) {
    super(props);
    this.id = props.id;
  }

  static create(
    props: CommandProps<DeleteOperationCommand>,
  ): DeleteOperationCommand {
    return new DeleteOperationCommand(props);
  }
}
