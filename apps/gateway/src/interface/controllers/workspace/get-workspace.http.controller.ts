import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { WorkspaceMapper } from 'apps/gateway/src/infrastructure/mappers/workspace.mapper';
import { GetWorkspaceRequestDto } from '../../dtos/workspace/get-workspace.request.dto';
import { WorkspaceResponseDto } from '../../dtos/workspace/workspace.response.dto';
import { GetWorkspaceQuery } from '../../queries/workspace/get-workspace.query';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';

@Controller('v1')
export class GetWorkspaceController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: WorkspaceMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('workspace')
  async get(
    @Body() body: GetWorkspaceRequestDto,
    @Req() request: any,
  ): Promise<WorkspaceResponseDto> {
    try {
      const query = GetWorkspaceQuery.create({
        id: body.id,
      });
      const result = await this.queryBus.execute(query);
      const response = this.mapper.toResponse(result);
      return response;
    } catch (error) {
      this.logger.error(
        'GetWorkspaceController.get encountered an error',
        error,
      );
    }
  }
}
