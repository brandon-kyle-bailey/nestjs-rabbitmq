import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'libs/config/configuration';
import { DatabaseModule } from './infrastructure/adapters/database/database.module';
import { StripeModule } from './infrastructure/adapters/stripe/stripe.module';
import { CreatePaymentIntentEventController } from './interface/controllers/create-payment-intent.event.controller';
import { PaymentIntentEventsController } from './interface/controllers/payment-intent-events.http.controller';

const entities = [];

const repositories = [];

const mappers = [];

const services = [];

const controllers = [
  CreatePaymentIntentEventController,
  PaymentIntentEventsController,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CqrsModule,
    DatabaseModule,
    StripeModule,
    TypeOrmModule.forFeature(entities),
    EventEmitterModule.forRoot({ global: true }),
  ],
  controllers,
  providers: [Logger, ConfigService, ...repositories, ...mappers, ...services],
})
export class BillingModule {}
