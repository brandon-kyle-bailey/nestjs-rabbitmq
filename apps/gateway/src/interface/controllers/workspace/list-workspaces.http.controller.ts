import { Controller, Get, Logger, Query, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { WorkspaceEntity } from 'apps/gateway/src/core/domain/entities/workspace.entity';
import { WorkspaceMapper } from 'apps/gateway/src/infrastructure/mappers/workspace.mapper';
import { PaginatedQueryRequestDto } from 'libs/dto/paginated-query.request.dto';
import { WorkspacePaginatedResponseDto } from '../../dtos/workspace/workspace.paginated.response.dto';
import { ListWorkspacesQuery } from '../../queries/workspace/list-workspaces.query';

@Controller('v1')
export class ListWorkspacesController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: WorkspaceMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('workspace/all')
  async list(
    @Query() queryParams: PaginatedQueryRequestDto,
    @Req() request: any,
  ): Promise<WorkspacePaginatedResponseDto> {
    try {
      const query = ListWorkspacesQuery.create({
        limit: queryParams?.limit,
        page: queryParams?.page,
      });
      const result = await this.queryBus.execute(query);
      return new WorkspacePaginatedResponseDto({
        ...result,
        data: result.data.map((res: WorkspaceEntity) =>
          this.mapper.toResponse(res),
        ),
      });
    } catch (error) {
      this.logger.error(
        'ListWorkspacesController.list encountered an error',
        error,
      );
    }
  }
}
