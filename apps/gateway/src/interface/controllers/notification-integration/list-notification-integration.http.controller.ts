import { Controller, Get, Logger, Query, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { PaginatedQueryRequestDto } from 'libs/dto/paginated-query.request.dto';
import { ListNotificationIntegrationQuery } from '../../queries/notification-integration/list-notification-integration.query';
import { NotificationIntegrationEntity } from 'apps/gateway/src/core/domain/entities/notification-integration.entity';
import { NotificationIntegrationMapper } from 'apps/gateway/src/infrastructure/mappers/notification-integration.mapper';
import { NotificationIntegrationPaginatedResponseDto } from '../../dtos/notification-integration/notification-integration.paginated.response.dto';

@Controller('v1')
export class ListNotificationIntegrationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: NotificationIntegrationMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('notification-integration/all')
  async list(
    @Query() queryParams: PaginatedQueryRequestDto,
    @Req() request: any,
  ): Promise<NotificationIntegrationPaginatedResponseDto> {
    try {
      const query = ListNotificationIntegrationQuery.create({
        limit: queryParams?.limit,
        page: queryParams?.page,
        userId: request.user.sub,
      });
      const result = await this.queryBus.execute(query);
      return new NotificationIntegrationPaginatedResponseDto({
        ...result,
        data: result.data.map((res: NotificationIntegrationEntity) =>
          this.mapper.toResponse(res),
        ),
      });
    } catch (error) {
      this.logger.error(
        'ListNotificationIntegrationController.list encountered an error',
        error,
      );
    }
  }
}
