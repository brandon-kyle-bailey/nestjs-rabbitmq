import { Body, Controller, Logger, Put, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { ScheduledTaskIncidentNotificationMapper } from 'apps/gateway/src/infrastructure/mappers/scheduled-task-incident-notification.mapper';
import { ScheduledTaskIncidentNotificationResponseDto } from '../../dtos/scheduled-task-incident-notification/scheduled-task-incident-notification.response.dto';
import { UpdateScheduledTaskIncidentNotificationRequestDto } from '../../dtos/scheduled-task-incident-notification/update-scheduled-task-incident-notification.request.dto';
import { UpdateScheduledTaskIncidentNotificationCommand } from '../../commands/scheduled-task-incident-notification/update-scheduled-task-incident-notification.command';

@Controller('v1')
export class UpdateScheduledTaskIncidentNotificationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: ScheduledTaskIncidentNotificationMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Put('scheduled-task-incident-notification')
  async update(
    @Body() body: UpdateScheduledTaskIncidentNotificationRequestDto,
    @Req() request: any,
  ): Promise<ScheduledTaskIncidentNotificationResponseDto> {
    try {
      const command = UpdateScheduledTaskIncidentNotificationCommand.create({
        ...body,
        userId: request.user.sub,
        statusPrefix: body.statusPrefix,
      });
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'UpdateScheduledTaskIncidentNotificationController.update encountered an error',
        error,
      );
    }
  }
}
