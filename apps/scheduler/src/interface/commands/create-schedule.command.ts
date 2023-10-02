import { Command, CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';

export class CreateScheduleCommand extends Command {
  readonly operationId: AggregateID;
  readonly type: string;
  readonly interval: number;
  readonly active: boolean;

  private constructor(props: CommandProps<CreateScheduleCommand>) {
    super(props);
    this.operationId = props.operationId;
    this.type = props.type;
    this.interval = props.interval;
    this.active = props.active;
  }

  static create(
    props: CommandProps<CreateScheduleCommand>,
  ): CreateScheduleCommand {
    return new CreateScheduleCommand(props);
  }
}
