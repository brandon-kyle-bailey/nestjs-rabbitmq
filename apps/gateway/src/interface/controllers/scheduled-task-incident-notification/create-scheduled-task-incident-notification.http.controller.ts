import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { ScheduledTaskIncidentNotificationMapper } from 'apps/gateway/src/infrastructure/mappers/scheduled-task-incident-notification.mapper';
import { CreateScheduledTaskIncidentNotificationRequestDto } from '../../dtos/scheduled-task-incident-notification/create-scheduled-task-incident-notification.request.dto';
import { ScheduledTaskIncidentNotificationResponseDto } from '../../dtos/scheduled-task-incident-notification/scheduled-task-incident-notification.response.dto';
import { CreateScheduledTaskIncidentNotificationCommand } from '../../commands/scheduled-task-incident-notification/create-scheduled-task-incident-notification.command';

@Controller('v1')
export class CreateScheduledTaskIncidentNotificationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: ScheduledTaskIncidentNotificationMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Post('scheduled-task-incident-notification')
  async create(
    @Body() body: CreateScheduledTaskIncidentNotificationRequestDto,
    @Req() request: any,
  ): Promise<ScheduledTaskIncidentNotificationResponseDto> {
    try {
      const command = CreateScheduledTaskIncidentNotificationCommand.create({
        ...body,
        ownerId: request.user.sub,
      });
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreateScheduledTaskIncidentNotificationController.create encountered an error',
        error,
      );
    }
  }
}
