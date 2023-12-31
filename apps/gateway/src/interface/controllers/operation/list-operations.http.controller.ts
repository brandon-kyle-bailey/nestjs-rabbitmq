import { Controller, Get, Logger, Query, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { OperationMapper } from '../../../infrastructure/mappers/operation.mapper';
import { PaginatedQueryRequestDto } from 'libs/dto/paginated-query.request.dto';
import { ListOperationsQuery } from '../../queries/operation/list-operations.query';
import { OperationPaginatedResponseDto } from '../../dtos/operation/operation.paginated.response.dto';
import { OperationEntity } from '../../../core/domain/entities/operation.entity';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
@Controller('v1')
export class ListOperationsController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: OperationMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('operation/all')
  async list(
    @Query() queryParams: PaginatedQueryRequestDto,
    @Req() request: any,
  ): Promise<OperationPaginatedResponseDto> {
    try {
      const query = ListOperationsQuery.create({
        limit: queryParams?.limit,
        page: queryParams?.page,
      });
      const result = await this.queryBus.execute(query);
      return new OperationPaginatedResponseDto({
        ...result,
        data: result.data.map((res: OperationEntity) =>
          this.mapper.toResponse(res),
        ),
      });
    } catch (error) {
      this.logger.error(
        'ListOperationsController.list encountered an error',
        error,
      );
    }
  }
}
