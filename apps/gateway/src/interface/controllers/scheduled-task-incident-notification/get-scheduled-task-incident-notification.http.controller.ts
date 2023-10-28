import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { ScheduledTaskIncidentNotificationMapper } from 'apps/gateway/src/infrastructure/mappers/scheduled-task-incident-notification.mapper';
import { GetScheduledTaskIncidentNotificationRequestDto } from '../../dtos/scheduled-task-incident-notification/get-scheduled-task-incident-notification.request.dto';
import { ScheduledTaskIncidentNotificationResponseDto } from '../../dtos/scheduled-task-incident-notification/scheduled-task-incident-notification.response.dto';
import { GetScheduledTaskIncidentNotificationQuery } from '../../queries/scheduled-task-incident-notification/get-scheduled-task-incident-notification.query';

@Controller('v1')
export class GetScheduledTaskIncidentNotificationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: ScheduledTaskIncidentNotificationMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('scheduled-task-incident-notification')
  async get(
    @Body() body: GetScheduledTaskIncidentNotificationRequestDto,
    @Req() request: any,
  ): Promise<ScheduledTaskIncidentNotificationResponseDto> {
    try {
      const query = GetScheduledTaskIncidentNotificationQuery.create({
        id: body.id,
      });
      const result = await this.queryBus.execute(query);
      const response = this.mapper.toResponse(result);
      return response;
    } catch (error) {
      this.logger.error(
        'GetScheduledTaskIncidentNotificationController.get encountered an error',
        error,
      );
    }
  }
}
