import { Logger, Module } from '@nestjs/common';
import { SmtpModule } from './infrastructure/adapters/smtp/smtp.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'libs/config/configuration';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SendEmailController } from './interface/controllers/send-email.http.controller';

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
  controllers: [SendEmailController],
  providers: [Logger, ConfigService],
})
export class NotificationsModule {}
