import { Command, CommandProps } from 'libs/ddd/command.base';

export class DeleteScheduleCommand extends Command {
  readonly id: string;

  private constructor(props: CommandProps<DeleteScheduleCommand>) {
    super(props);
    this.id = props.id;
  }

  static create(
    props: CommandProps<DeleteScheduleCommand>,
  ): DeleteScheduleCommand {
    return new DeleteScheduleCommand(props);
  }
}
