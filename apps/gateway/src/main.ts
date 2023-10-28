import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import configuration from 'libs/config/configuration';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const {
  services: {
    gateway: {
      transport: {
        rabbitmq: { url, queueOptions, noAck, queue: gatewayQueue },
      },
      web: { port },
    },
  },
} = configuration();

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: gatewayQueue,
        queueOptions,
        noAck,
      },
    },
    { inheritAppConfig: true },
  );

  app.startAllMicroservices();
  app.enableShutdownHooks();

  await app.listen(port);
}
bootstrap();
