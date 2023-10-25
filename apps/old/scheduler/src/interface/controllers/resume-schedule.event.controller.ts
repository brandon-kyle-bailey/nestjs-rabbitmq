import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OperationIntegrationEvents } from 'libs/events/operation.events';
import { AggregateID } from 'libs/ddd/entity.base';
import { CommandBus } from '@nestjs/cqrs';
import { ResumeScheduleCommand } from '../commands/resume-schedule.command';
import { ResumeScheduleRequestDto } from '../dtos/schedule/resume-schedule.request.dto';

@Controller()
export class ResumeScheduleEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @EventPattern(OperationIntegrationEvents.Resume)
  async resume(
    @Payload() payload: ResumeScheduleRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<AggregateID> {
    try {
      this.logger.debug(
        `ResumeScheduleEventController.resume invoked with payload`,
        payload,
      );
      const command = ResumeScheduleCommand.create(payload);
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'ResumeScheduleEventController.resume encountered an error',
        error,
      );
    }
  }
}
