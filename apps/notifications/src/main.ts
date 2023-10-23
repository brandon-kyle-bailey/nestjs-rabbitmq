import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import configuration from 'libs/config/configuration';
import { NotificationsModule } from './notifications.module';

const {
  services: {
    notifications: {
      web: { port },
      transport: {
        rabbitmq: { url, queue, queueOptions, noAck },
      },
    },
  },
} = configuration();

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
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
