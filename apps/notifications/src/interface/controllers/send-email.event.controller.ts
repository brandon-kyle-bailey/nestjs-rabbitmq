import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotificationsIntegrationEvents } from 'libs/events/notifications.events';
import { SendEmailRequestDto } from '../dtos/send-email.request.dto';
import { SendEmailCommand } from '../commands/send-email.command';

@Controller()
export class SendEmailEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @EventPattern(NotificationsIntegrationEvents.SendEmail)
  async send(
    @Payload() payload: SendEmailRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      const command = SendEmailCommand.create(payload);
      await this.commandBus.execute(command);
    } catch (error) {
      this.logger.error(
        'SendEmailEventController.send encountered an error',
        error,
      );
    }
  }
}
