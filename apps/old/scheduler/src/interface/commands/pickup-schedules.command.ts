import { Command, CommandProps } from 'libs/ddd/command.base';

export class PickupSchedulesCommand extends Command {
  private constructor(props: CommandProps<PickupSchedulesCommand>) {
    super(props);
  }

  static create(
    props: CommandProps<PickupSchedulesCommand>,
  ): PickupSchedulesCommand {
    return new PickupSchedulesCommand(props);
  }
}
