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
import { DeleteNotificationIntegrationRequestDto } from '../../dtos/notification-integration/delete-notification-integration.request.dto';
import { DeleteNotificationIntegrationCommand } from '../../commands/notification-integration/delete-notification-integration.command';
@Controller('v1')
export class DeleteNotificationIntegrationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard)
  @Delete('notification-integration')
  async delete(
    @Body() body: DeleteNotificationIntegrationRequestDto,
    @Req() request: any,
  ): Promise<AggregateID> {
    try {
      const command = DeleteNotificationIntegrationCommand.create({
        ...body,
        userId: request.user.sub,
      });
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'DeleteNotificationIntegrationController.delete encountered an error',
        error,
      );
    }
  }
}
