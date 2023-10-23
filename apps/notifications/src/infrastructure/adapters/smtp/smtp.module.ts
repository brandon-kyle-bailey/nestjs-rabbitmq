import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { adapters, config } from './smtp.adapters';

@Module({
  imports: [MailerModule.forRoot(config)],
  providers: [],
  exports: [MailerModule],
})
export class SmtpModule {}
