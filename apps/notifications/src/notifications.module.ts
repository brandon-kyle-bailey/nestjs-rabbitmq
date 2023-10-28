import { Logger, Module } from '@nestjs/common';
import { SmtpModule } from './infrastructure/adapters/smtp/smtp.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'libs/config/configuration';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SendEmailEventController } from './interface/controllers/send-email.event.controller';
import { SendEmailService } from './core/application/services/send-email.service';
import { HttpModule } from '@nestjs/axios';
import { SendWebhookEventController } from './interface/controllers/send-webhook.event.controller';
import { SendWebhookService } from './core/application/services/send-webhook.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CqrsModule,
    HttpModule,
    EventEmitterModule.forRoot({ global: true }),
    SmtpModule,
  ],
  controllers: [SendEmailEventController, SendWebhookEventController],
  providers: [Logger, ConfigService, SendEmailService, SendWebhookService],
})
export class NotificationsModule {}
