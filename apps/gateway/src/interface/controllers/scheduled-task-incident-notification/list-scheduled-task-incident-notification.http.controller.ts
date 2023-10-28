import { Controller, Get, Logger, Query, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { ScheduledTaskIncidentNotificationEntity } from 'apps/gateway/src/core/domain/entities/scheduled-task-incident-notification.entity';
import { ScheduledTaskIncidentNotificationMapper } from 'apps/gateway/src/infrastructure/mappers/scheduled-task-incident-notification.mapper';
import { PaginatedQueryRequestDto } from 'libs/dto/paginated-query.request.dto';
import { ScheduledTaskIncidentNotificationPaginatedResponseDto } from '../../dtos/scheduled-task-incident-notification/scheduled-task-incident-notification.paginated.response.dto';
import { ListScheduledTaskIncidentNotificationQuery } from '../../queries/scheduled-task-incident-notification/list-scheduled-task-incident-notification.query';

@Controller('v1')
export class ListScheduledTaskIncidentNotificationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: ScheduledTaskIncidentNotificationMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('scheduled-task-incident-notification/all')
  async list(
    @Query() queryParams: PaginatedQueryRequestDto,
    @Req() request: any,
  ): Promise<ScheduledTaskIncidentNotificationPaginatedResponseDto> {
    try {
      const query = ListScheduledTaskIncidentNotificationQuery.create({
        limit: queryParams?.limit,
        page: queryParams?.page,
        userId: request.user.sub,
      });
      const result = await this.queryBus.execute(query);
      return new ScheduledTaskIncidentNotificationPaginatedResponseDto({
        ...result,
        data: result.data.map((res: ScheduledTaskIncidentNotificationEntity) =>
          this.mapper.toResponse(res),
        ),
      });
    } catch (error) {
      this.logger.error(
        'ListScheduledTaskIncidentNotificationController.list encountered an error',
        error,
      );
    }
  }
}
