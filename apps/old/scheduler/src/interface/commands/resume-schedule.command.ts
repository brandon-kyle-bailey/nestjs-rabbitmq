import { Command, CommandProps } from 'libs/ddd/command.base';

export class ResumeScheduleCommand extends Command {
  readonly operationId: string;

  private constructor(props: CommandProps<ResumeScheduleCommand>) {
    super(props);
    this.operationId = props.operationId;
  }

  static create(
    props: CommandProps<ResumeScheduleCommand>,
  ): ResumeScheduleCommand {
    return new ResumeScheduleCommand(props);
  }
}
