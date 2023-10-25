import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ScheduleIntegrationEvents } from 'libs/events/schedule.events';
import { ProcessEventRequestDto } from '../dtos/process-event/process-event.request.dto';
import { ProcessEventResponseDto } from '../dtos/process-event/process-event.response.dto';
import { ProcessEventCommand } from '../commands/process-event.command';
import { ProcessEventMapper } from '../../infrastructure/mappers/process-event.mapper';

@Controller()
export class ProcessEventEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: ProcessEventMapper,
  ) {}

  @EventPattern(ScheduleIntegrationEvents.Load)
  async create(
    @Payload() payload: ProcessEventRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<ProcessEventResponseDto> {
    try {
      const command = ProcessEventCommand.create({
        operationId: payload.operationId,
      });
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'ProcessEventEventController.create encountered an error',
        error,
      );
    }
  }
}
