import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { NotificationIntegrationMapper } from 'apps/gateway/src/infrastructure/mappers/notification-integration.mapper';
import { CreateNotificationIntegrationCommand } from '../../commands/notification-integration/create-notification-integration.command';
import { CreateNotificationIntegrationRequestDto } from '../../dtos/notification-integration/create-notification-integration.request.dto';
import { NotificationIntegrationResponseDto } from '../../dtos/notification-integration/notification-integration.response.dto';

@Controller('v1')
export class CreateNotificationIntegrationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: NotificationIntegrationMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Post('notification-integration')
  async create(
    @Body() body: CreateNotificationIntegrationRequestDto,
    @Req() request: any,
  ): Promise<NotificationIntegrationResponseDto> {
    try {
      const command = CreateNotificationIntegrationCommand.create({
        ...body,
        ownerId: request.user.sub,
      });
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreateNotificationIntegrationController.create encountered an error',
        error,
      );
    }
  }
}
