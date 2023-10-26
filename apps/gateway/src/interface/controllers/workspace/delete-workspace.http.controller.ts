import {
  Body,
  Controller,
  Delete,
  Logger,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AggregateID } from 'libs/ddd/entity.base';
import { DeleteWorkspaceRequestDto } from '../../dtos/workspace/delete-workspace.request.dto';
import { DeleteWorkspaceCommand } from '../../commands/workspace/delete-workspace.command';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
@Controller('v1')
export class DeleteWorkspaceController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard)
  @Delete('workspace')
  async delete(
    @Body() body: DeleteWorkspaceRequestDto,
    @Req() request: any,
  ): Promise<AggregateID> {
    try {
      const command = DeleteWorkspaceCommand.create({
        ...body,
        userId: request.user.sub,
      });
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'DeleteWorkspaceController.delete encountered an error',
        error,
      );
    }
  }
}
