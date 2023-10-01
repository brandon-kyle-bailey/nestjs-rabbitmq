import * as dotenv from 'dotenv';
import { AdapterNames } from 'libs/common/enum/adapters/adapters.enum';
dotenv.config();

export default () => ({
  services: {
    gateway: {
      name: AdapterNames.GatewayService,
      database: {
        driver: process.env.DATABASE_DRIVER,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT_GATEWAY, 10),
        name: process.env.DATABASE_NAME_GATEWAY,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
      },
    },
    scheduler: {
      name: AdapterNames.SchedulerService,
      database: {
        driver: process.env.DATABASE_DRIVER,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT_SCHEDULER, 10),
        name: process.env.DATABASE_NAME_SCHEDULER,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
      },
      rabbitmq: {
        url: `amqp://${process.env.RABBITMQ_USERNAME}:${
          process.env.RABBITMQ_PASSWORD
        }@${process.env.RABBITMQ_HOST}:${parseInt(
          process.env.RABBITMQ_PORT,
          10,
        )}`,
        host: process.env.RABBITMQ_HOST,
        port: parseInt(process.env.RABBITMQ_PORT, 10),
        queue: process.env.RABBITMQ_QUEUE_SCHEDULER,
        username: process.env.RABBITMQ_USERNAME,
        password: process.env.RABBITMQ_PASSWORD,
        queueOptions: {
          durable: true,
        },
        noAck: false,
      },
    },
    processor: {
      name: AdapterNames.ProcessorService,
      database: {
        driver: process.env.DATABASE_DRIVER,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT_PROCESSOR, 10),
        name: process.env.DATABASE_NAME_PROCESSOR,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
      },
      rabbitmq: {
        url: `amqp://${process.env.RABBITMQ_USERNAME}:${
          process.env.RABBITMQ_PASSWORD
        }@${process.env.RABBITMQ_HOST}:${parseInt(
          process.env.RABBITMQ_PORT,
          10,
        )}`,
        host: process.env.RABBITMQ_HOST,
        port: parseInt(process.env.RABBITMQ_PORT, 10),
        queue: process.env.RABBITMQ_QUEUE_PROCESSOR,
        username: process.env.RABBITMQ_USERNAME,
        password: process.env.RABBITMQ_PASSWORD,
        queueOptions: {
          durable: true,
        },
        noAck: false,
      },
    },
  },
});
