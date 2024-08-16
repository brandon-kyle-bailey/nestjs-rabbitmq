import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { SendEmailRequestDto } from '../dtos/send-email.request.dto';
import { NotificationIntegrationEvents } from 'libs/events/notification.events';

@Controller()
export class SendEmailEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly service: MailerService,
  ) {}

  @EventPattern(NotificationIntegrationEvents.SendEmail)
  async send(
    @Payload() payload: SendEmailRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      await this.service.sendMail({
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: `<body>${payload.text}</body>`,
    })
  } catch (error) {
      this.logger.error('SendEmailController.send encountered an error', error);
    }
  }
}
