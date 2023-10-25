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
      web: { port },
    },
  },
} = configuration();

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue,
      queueOptions,
      noAck,
    },
  });

  app.startAllMicroservices();
  app.enableShutdownHooks();
  await app.listen(port);
}
bootstrap();
