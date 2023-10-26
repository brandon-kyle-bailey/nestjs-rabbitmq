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
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { DeleteScheduledTaskRequestDto } from '../../dtos/scheduled-task/delete-scheduled-task.request.dto';
import { DeleteScheduledTaskCommand } from '../../commands/scheduled-task/delete-scheduled-task.command';

@Controller('v1')
export class DeleteScheduledTaskController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard)
  @Delete('scheduled-task')
  async delete(
    @Body() body: DeleteScheduledTaskRequestDto,
    @Req() request: any,
  ): Promise<AggregateID> {
    try {
      const command = DeleteScheduledTaskCommand.create({
        id: body.id,
        userId: request.user.sub,
      });
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'DeleteScheduledTaskController.delete encountered an error',
        error,
      );
    }
  }
}
