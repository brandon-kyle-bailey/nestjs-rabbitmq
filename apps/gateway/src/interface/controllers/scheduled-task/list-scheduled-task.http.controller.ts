import { Controller, Get, Logger, Query, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { ScheduledTaskEntity } from 'apps/gateway/src/core/domain/entities/scheduled-task.entity';
import { ScheduledTaskMapper } from 'apps/gateway/src/infrastructure/mappers/scheduled-task.mapper';
import { PaginatedQueryRequestDto } from 'libs/dto/paginated-query.request.dto';
import { ScheduledTaskPaginatedResponseDto } from '../../dtos/scheduled-task/scheduled-task.paginated.response.dto';
import { ListScheduledTaskQuery } from '../../queries/scheduled-task/list-scheduled-task.query';

@Controller('v1')
export class ListScheduledTaskController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: ScheduledTaskMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('scheduled-task/all')
  async list(
    @Query() queryParams: PaginatedQueryRequestDto,
    @Req() request: any,
  ): Promise<ScheduledTaskPaginatedResponseDto> {
    try {
      const query = ListScheduledTaskQuery.create({
        limit: queryParams?.limit,
        page: queryParams?.page,
      });
      const result = await this.queryBus.execute(query);
      return new ScheduledTaskPaginatedResponseDto({
        ...result,
        data: result.data.map((res: ScheduledTaskEntity) =>
          this.mapper.toResponse(res),
        ),
      });
    } catch (error) {
      this.logger.error(
        'ListScheduledTaskController.list encountered an error',
        error,
      );
    }
  }
}
