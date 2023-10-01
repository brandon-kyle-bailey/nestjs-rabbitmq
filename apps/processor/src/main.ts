import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import configuration from 'libs/config/configuration';
import { ProcessorModule } from './processor.module';

const {
  services: {
    processor: {
      rabbitmq: { username, password, host, port, queue },
    },
  },
} = configuration();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProcessorModule,
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
