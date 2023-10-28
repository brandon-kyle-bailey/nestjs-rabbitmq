import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class VerifyScheduledTaskIncidentCommand extends Command {
  readonly scheduledTaskId: AggregateID;
  readonly status: number;
  readonly duration: number;
  readonly response: string;
  readonly createdAt: Date;

  private constructor(props: CommandProps<VerifyScheduledTaskIncidentCommand>) {
    super(props);
    this.scheduledTaskId = props.scheduledTaskId;
    this.status = props.status;
    this.duration = props.duration;
    this.response = props.response;
    this.createdAt = props.createdAt;
  }

  static create(
    props: CommandProps<VerifyScheduledTaskIncidentCommand>,
  ): VerifyScheduledTaskIncidentCommand {
    return new VerifyScheduledTaskIncidentCommand(props);
  }
}
