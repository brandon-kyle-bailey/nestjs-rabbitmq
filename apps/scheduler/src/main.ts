import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { SchedulerModule } from './scheduler.module';
import configuration from 'libs/config/configuration';
import { Logger } from '@nestjs/common';
import { PickupSchedulesCliController } from './interface/controllers/pickup-schedules.cli.controller';

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

  const pickupSchedulesController = app.get<PickupSchedulesCliController>(
    PickupSchedulesCliController,
  );

  app.enableShutdownHooks();
  await app.listen();

  // invoke warmup controller for schedule pickup
  await pickupSchedulesController.pickup();
}
bootstrap();
