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
import { DeleteScheduledTaskIncidentNotificationRequestDto } from '../../dtos/scheduled-task-incident-notification/delete-scheduled-task-incident-notification.request.dto';
import { DeleteScheduledTaskIncidentNotificationCommand } from '../../commands/scheduled-task-incident-notification/delete-scheduled-task-incident-notification.command';

@Controller('v1')
export class DeleteScheduledTaskIncidentNotificationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard)
  @Delete('scheduled-task-incident-notification')
  async delete(
    @Body() body: DeleteScheduledTaskIncidentNotificationRequestDto,
    @Req() request: any,
  ): Promise<AggregateID> {
    try {
      const command = DeleteScheduledTaskIncidentNotificationCommand.create({
        ...body,
        userId: request.user.sub,
      });
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'DeleteScheduledTaskIncidentNotificationController.delete encountered an error',
        error,
      );
    }
  }
}
