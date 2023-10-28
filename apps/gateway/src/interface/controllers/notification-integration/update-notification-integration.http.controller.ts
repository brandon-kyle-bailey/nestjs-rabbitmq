import { Body, Controller, Logger, Put, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { NotificationIntegrationMapper } from 'apps/gateway/src/infrastructure/mappers/notification-integration.mapper';
import { UpdateNotificationIntegrationCommand } from '../../commands/notification-integration/update-notification-integration.command';
import { NotificationIntegrationResponseDto } from '../../dtos/notification-integration/notification-integration.response.dto';
import { UpdateNotificationIntegrationRequestDto } from '../../dtos/notification-integration/update-notification-integration.request.dto';

@Controller('v1')
export class UpdateNotificationIntegrationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: NotificationIntegrationMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Put('notification-integration')
  async update(
    @Body() body: UpdateNotificationIntegrationRequestDto,
    @Req() request: any,
  ): Promise<NotificationIntegrationResponseDto> {
    try {
      const command = UpdateNotificationIntegrationCommand.create({
        ...body,
        userId: request.user.sub,
      });
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'UpdateNotificationIntegrationController.update encountered an error',
        error,
      );
    }
  }
}
