import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class UpdateWorkspaceCommand extends Command {
  readonly id: AggregateID;
  readonly userId: AggregateID;
  readonly name?: string;

  private constructor(props: CommandProps<UpdateWorkspaceCommand>) {
    super(props);
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
  }

  static create(
    props: CommandProps<UpdateWorkspaceCommand>,
  ): UpdateWorkspaceCommand {
    return new UpdateWorkspaceCommand(props);
  }
}
