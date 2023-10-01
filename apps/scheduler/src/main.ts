import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { SchedulerModule } from './scheduler.module';
import configuration from 'libs/config/configuration';

const {
  services: {
    scheduler: {
      rabbitmq: { username, password, host, port, queue },
    },
  },
} = configuration();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SchedulerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${username}:${password}@${host}:${port}`],
        queue: queue,
        queueOptions: {
          durable: true,
        },
        noAck: true,
      },
    },
  );
  await app.listen();
}
bootstrap();
