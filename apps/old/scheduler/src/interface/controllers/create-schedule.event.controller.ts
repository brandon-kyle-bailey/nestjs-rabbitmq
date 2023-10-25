import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OperationIntegrationEvents } from 'libs/events/operation.events';
import { ScheduleMapper } from '../../infrastructure/mappers/schedule.mapper';
import { ScheduleResponseDto } from '../dtos/schedule/schedule.response.dto';
import { CreateScheduleRequestDto } from '../dtos/schedule/create-schedule.request.dto';
import { CreateScheduleCommand } from '../commands/create-schedule.command';

@Controller()
export class CreateScheduleEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly scheduleMapper: ScheduleMapper,
  ) {}

  @EventPattern(OperationIntegrationEvents.Schedule)
  async create(
    @Payload() payload: CreateScheduleRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<ScheduleResponseDto> {
    try {
      const command = CreateScheduleCommand.create({
        operationId: payload.operationId,
        type: payload.type,
        interval: payload.interval,
        active: payload.active,
      });
      const result = await this.commandBus.execute(command);
      return this.scheduleMapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreateScheduleEventController.create encountered an error',
        error,
      );
    }
  }
}
