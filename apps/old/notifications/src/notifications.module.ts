import { Logger, Module } from '@nestjs/common';
import { SmtpModule } from './infrastructure/adapters/smtp/smtp.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'libs/config/configuration';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SendEmailEventController } from './interface/controllers/send-email.event.controller';
import { SendEmailService } from './core/application/services/send-email.service';

@Module({
  imports: [
    SmtpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CqrsModule,
    EventEmitterModule.forRoot({ global: true }),
  ],
  controllers: [SendEmailEventController],
  providers: [Logger, ConfigService, SendEmailService],
})
export class NotificationsModule {}
