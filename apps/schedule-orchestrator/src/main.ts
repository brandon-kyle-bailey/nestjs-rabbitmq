import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import configuration from 'libs/config/configuration';
import { ScheduleOrchestratorModule } from './schedule-orchestrator.module';
import { PickupSchedulesCliController } from './interface/controllers/pickup-schedules.cli.controller';

const {
  services: {
    schedule_orchestrator: {
      transport: {
        rabbitmq: { url, queue, queueOptions, noAck },
      },
    },
  },
} = configuration();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ScheduleOrchestratorModule,
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

  const pickupSchedulesController = app.get<PickupSchedulesCliController>(
    PickupSchedulesCliController,
  );

  app.enableShutdownHooks();
  await app.listen();

  // invoke warmup controller for schedule pickup
  await pickupSchedulesController.pickup();
}
bootstrap();
