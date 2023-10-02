import { Command, CommandProps } from 'libs/ddd/command.base';

export class DeleteScheduleCommand extends Command {
  readonly operationId: string;

  private constructor(props: CommandProps<DeleteScheduleCommand>) {
    super(props);
    this.operationId = props.operationId;
  }

  static create(
    props: CommandProps<DeleteScheduleCommand>,
  ): DeleteScheduleCommand {
    return new DeleteScheduleCommand(props);
  }
}
