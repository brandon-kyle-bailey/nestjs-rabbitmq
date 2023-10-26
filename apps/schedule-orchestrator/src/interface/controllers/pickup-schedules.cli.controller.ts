import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { NIL, v4 } from 'uuid';
import { PickupSchedulesCommand } from '../commands/pickup-schedules.command';

@Controller()
export class PickupSchedulesCliController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  async pickup(): Promise<void> {
    try {
      const command = PickupSchedulesCommand.create({
        metadata: {
          userId: NIL,
          correlationId: v4(),
          timestamp: Date.now(),
        },
      });
      const result = await this.commandBus.execute(command);
    } catch (error) {
      this.logger.error(
        'PickupSchedulesCliController.pickup encountered an error',
        error,
      );
    }
  }
}
