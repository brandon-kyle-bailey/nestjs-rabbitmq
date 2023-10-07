import { Command, CommandProps } from 'libs/ddd/command.base';

export class ResumeOperationCommand extends Command {
  readonly id: string;

  private constructor(props: CommandProps<ResumeOperationCommand>) {
    super(props);
    this.id = props.id;
  }

  static create(
    props: CommandProps<ResumeOperationCommand>,
  ): ResumeOperationCommand {
    return new ResumeOperationCommand(props);
  }
}
