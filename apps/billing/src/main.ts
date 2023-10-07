import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import configuration from 'libs/config/configuration';
import { BillingModule } from './billing.module';

const {
  services: {
    billing: {
      transport: {
        rabbitmq: { url, queue, queueOptions, noAck },
      },
    },
  },
} = configuration();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BillingModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue,
        queueOptions,
        noAck,
      },
    },
  );

  app.enableShutdownHooks();
  await app.listen();
}
bootstrap();
