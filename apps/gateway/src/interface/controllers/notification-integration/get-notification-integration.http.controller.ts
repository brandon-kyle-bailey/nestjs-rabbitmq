import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { NotificationIntegrationMapper } from 'apps/gateway/src/infrastructure/mappers/notification-integration.mapper';
import { GetNotificationIntegrationRequestDto } from '../../dtos/notification-integration/get-notification-integration.request.dto';
import { NotificationIntegrationResponseDto } from '../../dtos/notification-integration/notification-integration.response.dto';
import { GetNotificationIntegrationQuery } from '../../queries/notification-integration/get-notification-integration.query';

@Controller('v1')
export class GetNotificationIntegrationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: NotificationIntegrationMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('notification-integration')
  async get(
    @Body() body: GetNotificationIntegrationRequestDto,
    @Req() request: any,
  ): Promise<NotificationIntegrationResponseDto> {
    try {
      const query = GetNotificationIntegrationQuery.create({
        id: body.id,
      });
      const result = await this.queryBus.execute(query);
      const response = this.mapper.toResponse(result);
      return response;
    } catch (error) {
      this.logger.error(
        'GetNotificationIntegrationController.get encountered an error',
        error,
      );
    }
  }
}
