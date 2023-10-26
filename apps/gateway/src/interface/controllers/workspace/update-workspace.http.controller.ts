import { Body, Controller, Logger, Put, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { WorkspaceMapper } from 'apps/gateway/src/infrastructure/mappers/workspace.mapper';
import { UpdateWorkspaceRequestDto } from '../../dtos/workspace/update-workspace.request.dto';
import { WorkspaceResponseDto } from '../../dtos/workspace/workspace.response.dto';
import { UpdateWorkspaceCommand } from '../../commands/workspace/update-workspace.command';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';

@Controller('v1')
export class UpdateWorkspaceController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: WorkspaceMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Put('workspace')
  async update(
    @Body() body: UpdateWorkspaceRequestDto,
    @Req() request: any,
  ): Promise<WorkspaceResponseDto> {
    try {
      const command = UpdateWorkspaceCommand.create({
        ...body,
        userId: request.user.sub,
      });
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'UpdateWorkspaceController.update encountered an error',
        error,
      );
    }
  }
}
