import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { WorkspaceMapper } from 'apps/gateway/src/infrastructure/mappers/workspace.mapper';
import { CreateWorkspaceRequestDto } from '../../dtos/workspace/create-workspace.request.dto';
import { WorkspaceResponseDto } from '../../dtos/workspace/workspace.response.dto';
import { CreateWorkspaceCommand } from '../../commands/workspace/create-workspace.command';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';

@Controller('v1')
export class CreateWorkspaceController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: WorkspaceMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Post('workspace')
  async create(
    @Body() body: CreateWorkspaceRequestDto,
    @Req() request: any,
  ): Promise<WorkspaceResponseDto> {
    try {
      const command = CreateWorkspaceCommand.create({
        ...body,
        ownerID: request.user.id,
      });
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreateWorkspaceController.create encountered an error',
        error,
      );
    }
  }
}
