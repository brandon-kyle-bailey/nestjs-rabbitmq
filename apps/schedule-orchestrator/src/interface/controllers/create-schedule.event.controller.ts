import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ScheduledTaskIntegrationEvents } from 'libs/events/scheduled-task.events';
import { ScheduleResponseDto } from '../dtos/schedule.response.dto';
import { ScheduleMapper } from '../../infrastructure/mappers/schedule.mapper';
import { CreateScheduleCommand } from '../commands/create-schedule.command';
import { CreateScheduleRequestDto } from '../dtos/create-schedule.request.dto';

@Controller()
export class CreateScheduleEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly scheduleMapper: ScheduleMapper,
  ) {}

  @EventPattern(ScheduledTaskIntegrationEvents.CreateSchedule)
  async create(
    @Payload() payload: CreateScheduleRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<ScheduleResponseDto> {
    try {
      this.logger.debug(
        `CreateScheduleEventController.create invoked with payload`,
        payload,
      );
      const command = CreateScheduleCommand.create({
        scheduledTaskId: payload.scheduledTaskId,
        protocol: payload.protocol,
        host: payload.host,
        port: payload.port,
        interval: payload.interval,
        type: payload.type,
        active: payload.active,
        payload: payload.payload,
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
