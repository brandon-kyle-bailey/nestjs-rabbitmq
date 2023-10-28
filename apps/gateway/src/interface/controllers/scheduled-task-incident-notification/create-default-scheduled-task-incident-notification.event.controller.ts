import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ScheduledTaskIncidentNotificationMapper } from 'apps/gateway/src/infrastructure/mappers/scheduled-task-incident-notification.mapper';
import { ScheduledTaskIncidentNotificationResponseDto } from '../../dtos/scheduled-task-incident-notification/scheduled-task-incident-notification.response.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { Payload } from '@nestjs/microservices';
import { CreateDefaultScheduledTaskIncidentNotificationEventRequestDto } from '../../dtos/scheduled-task-incident-notification/create-default-scheduled-task-incident-notification.event.request.dto';
import { ScheduledTaskIncidentNotificationCreatedDomainEvent } from 'apps/gateway/src/core/domain/entities/scheduled-task-incident-notification.entity';
import { CreateDefaultScheduledTaskIncidentNotificationCommand } from '../../commands/scheduled-task-incident-notification/create-default-scheduled-task-incident-notification.command';

@Controller()
export class CreateDefaultScheduledTaskIncidentNotificationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: ScheduledTaskIncidentNotificationMapper,
  ) {}

  @OnEvent(ScheduledTaskIncidentNotificationCreatedDomainEvent.name)
  async create(
    @Payload()
    payload: CreateDefaultScheduledTaskIncidentNotificationEventRequestDto,
  ): Promise<ScheduledTaskIncidentNotificationResponseDto> {
    try {
      const command =
        CreateDefaultScheduledTaskIncidentNotificationCommand.create(payload);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreateDefaultScheduledTaskIncidentNotificationController.create encountered an error',
        error,
      );
    }
  }
}
