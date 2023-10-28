import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotificationGenerics } from 'libs/common/enum/notification-generics.enum';
import { NotificationsIntegrationEvents } from 'libs/events/notifications.events';
import { SendWebhookRequestDto } from '../dtos/send-webhook.request.dto';
import { SendWebhookCommand } from '../commands/send-webhook.command';

@Controller()
export class SendWebhookEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @EventPattern(
    `${NotificationsIntegrationEvents.SendPrefix}.${NotificationGenerics.Webhook}`,
  )
  async send(
    @Payload() payload: SendWebhookRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      const command = SendWebhookCommand.create(payload);
      await this.commandBus.execute(command);
    } catch (error) {
      this.logger.error(
        'SendWebhookEventController.send encountered an error',
        error,
      );
    }
  }
}
