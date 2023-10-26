import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class DeleteWorkspaceCommand extends Command {
  readonly userId: AggregateID;
  readonly id: AggregateID;

  private constructor(props: CommandProps<DeleteWorkspaceCommand>) {
    super(props);
    this.userId = props.userId;
    this.id = props.id;
  }

  static create(
    props: CommandProps<DeleteWorkspaceCommand>,
  ): DeleteWorkspaceCommand {
    return new DeleteWorkspaceCommand(props);
  }
}
