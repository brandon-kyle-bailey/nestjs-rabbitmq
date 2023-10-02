import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import configuration from 'libs/config/configuration';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const {
  services: {
    gateway: {
      rabbitmq: { username, password, host, port, queue },
      web: { port: webPort },
    },
  },
} = configuration();

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.connectMicroservice<MicroserviceOptions>(
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
    { inheritAppConfig: true },
  );
  app.startAllMicroservices();
  app.enableShutdownHooks();
  await app.listen(webPort);
}
bootstrap();
