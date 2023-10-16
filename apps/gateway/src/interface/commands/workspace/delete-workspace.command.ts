import { Command, CommandProps } from 'libs/ddd/command.base';

export class DeleteWorkspaceCommand extends Command {
  readonly id: string;

  private constructor(props: CommandProps<DeleteWorkspaceCommand>) {
    super(props);
    this.id = props.id;
  }

  static create(
    props: CommandProps<DeleteWorkspaceCommand>,
  ): DeleteWorkspaceCommand {
    return new DeleteWorkspaceCommand(props);
  }
}
