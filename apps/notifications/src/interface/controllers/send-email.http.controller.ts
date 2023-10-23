import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Logger, Post, Req } from '@nestjs/common';

@Controller('v1')
export class SendEmailController {
  constructor(
    protected readonly logger: Logger,
    protected readonly mailerService: MailerService,
  ) {}

  @Post('send-email')
  async send(@Body() body: any, @Req() request: any): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to: 'user@example.com',
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome to Nice App! Confirm your Email',
        // template: './confirmation',
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>',
        context: {
          name: 'test',
        },
      });
    } catch (error) {
      this.logger.error('SendEmailController.send encountered an error', error);
    }
  }
}
