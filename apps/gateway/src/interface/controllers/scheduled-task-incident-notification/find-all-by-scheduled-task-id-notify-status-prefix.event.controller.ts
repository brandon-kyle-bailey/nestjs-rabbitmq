import { Controller, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ScheduledTaskIncidentNotificationPaginatedResponseDto } from '../../dtos/scheduled-task-incident-notification/scheduled-task-incident-notification.paginated.response.dto';
import { ScheduledTaskIncidentNotificationIntegrationEvents } from 'libs/events/scheduled-task-incident-notification.events';
import { ScheduledTaskIncidentNotificationMapper } from 'apps/gateway/src/infrastructure/mappers/scheduled-task-incident-notification.mapper';
import { ScheduledTaskIncidentNotificationEntity } from 'apps/gateway/src/core/domain/entities/scheduled-task-incident-notification.entity';
import { FindAllByScheduledTaskIdNotifyStatusPrefixRequestDto } from '../../dtos/scheduled-task-incident-notification/find-all-by-scheduled-task-id-notify-status-prefix.request.dto';
import { FindAllByScheduledTaskIdNotifyStatusPrefixQuery } from '../../queries/scheduled-task-incident-notification/find-all-by-scheduled-task-id-notify-status-prefix.query';

@Controller()
export class FindAllByScheduledTaskIdNotifyStatusPrefixEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: ScheduledTaskIncidentNotificationMapper,
  ) {}

  @EventPattern(
    ScheduledTaskIncidentNotificationIntegrationEvents.FindAllByScheduledTaskIdNotifyStatusPrefix,
  )
  async create(
    @Payload() payload: FindAllByScheduledTaskIdNotifyStatusPrefixRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<ScheduledTaskIncidentNotificationPaginatedResponseDto[]> {
    try {
      const command =
        FindAllByScheduledTaskIdNotifyStatusPrefixQuery.create(payload);
      const result = await this.queryBus.execute(command);
      return result.map((res: ScheduledTaskIncidentNotificationEntity) =>
        this.mapper.toResponse(res),
      );
    } catch (error) {
      this.logger.error(
        'FindAllByScheduledTaskIdNotifyStatusPrefixEventController.create encountered an error',
        error,
      );
    }
  }
}
