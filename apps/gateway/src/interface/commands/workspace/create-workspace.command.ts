import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class CreateWorkspaceCommand extends Command {
  readonly name: string;
  readonly ownerID: AggregateID;

  private constructor(props: CommandProps<CreateWorkspaceCommand>) {
    super(props);
    this.name = props.name;
    this.ownerID = props.ownerID;
  }

  static create(
    props: CommandProps<CreateWorkspaceCommand>,
  ): CreateWorkspaceCommand {
    return new CreateWorkspaceCommand(props);
  }
}
