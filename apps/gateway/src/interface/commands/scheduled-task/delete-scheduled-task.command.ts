import { Command, CommandProps } from 'libs/ddd/command.base';

export class DeleteScheduledTaskCommand extends Command {
  readonly id: string;

  private constructor(props: CommandProps<DeleteScheduledTaskCommand>) {
    super(props);
    this.id = props.id;
  }

  static create(
    props: CommandProps<DeleteScheduledTaskCommand>,
  ): DeleteScheduledTaskCommand {
    return new DeleteScheduledTaskCommand(props);
  }
}
