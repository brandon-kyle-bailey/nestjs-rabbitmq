import * as dotenv from 'dotenv';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
dotenv.config();

export default () => ({
  services: {
    gateway: {
      web: {
        port: parseInt(process.env.GATEWAY_PORT, 10),
      },
      transport: {
        rabbitmq: {
          name: TransportAdapterNames.TransportGatewayAdapterService,
          url: `amqp://${process.env.GATEWAY_RABBITMQ_USERNAME}:${
            process.env.GATEWAY_RABBITMQ_PASSWORD
          }@${process.env.GATEWAY_RABBITMQ_HOST}:${parseInt(
            process.env.GATEWAY_RABBITMQ_PORT,
            10,
          )}`,
          host: process.env.GATEWAY_RABBITMQ_HOST,
          port: parseInt(process.env.GATEWAY_RABBITMQ_PORT, 10),
          username: process.env.GATEWAY_RABBITMQ_USERNAME,
          password: process.env.GATEWAY_RABBITMQ_PASSWORD,
          queueOptions: {
            durable: true,
          },
          noAck: true,
          gateways: {
            processor: process.env.GATEWAY_PROCESSOR_RABBITMQ_QUEUE,
            auth: process.env.GATEWAY_AUTH_RABBITMQ_QUEUE,
            billing: process.env.GATEWAY_BILLING_RABBITMQ_QUEUE,
          },
        },
      },
      database: {
        postgres: {
          driver: process.env.GATEWAY_DATABASE_DRIVER,
          host: process.env.GATEWAY_DATABASE_HOST,
          port: parseInt(process.env.GATEWAY_DATABASE_PORT, 10),
          name: process.env.GATEWAY_DATABASE_NAME,
          username: process.env.GATEWAY_DATABASE_USERNAME,
          password: process.env.GATEWAY_DATABASE_PASSWORD,
        },
      },
    },
    auth: {
      web: {
        port: parseInt(process.env.AUTH_PORT, 10),
      },
      transport: {
        rabbitmq: {
          name: TransportAdapterNames.TransportAuthAdapterService,
          url: `amqp://${process.env.AUTH_RABBITMQ_USERNAME}:${
            process.env.AUTH_RABBITMQ_PASSWORD
          }@${process.env.AUTH_RABBITMQ_HOST}:${parseInt(
            process.env.AUTH_RABBITMQ_PORT,
            10,
          )}`,
          host: process.env.AUTH_RABBITMQ_HOST,
          port: parseInt(process.env.AUTH_RABBITMQ_PORT, 10),
          queue: process.env.AUTH_RABBITMQ_QUEUE,
          username: process.env.AUTH_RABBITMQ_USERNAME,
          password: process.env.AUTH_RABBITMQ_PASSWORD,
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },
      database: {
        postgres: {
          driver: process.env.AUTH_DATABASE_DRIVER,
          host: process.env.AUTH_DATABASE_HOST,
          port: parseInt(process.env.AUTH_DATABASE_PORT, 10),
          name: process.env.AUTH_DATABASE_NAME,
          username: process.env.AUTH_DATABASE_USERNAME,
          password: process.env.AUTH_DATABASE_PASSWORD,
        },
      },
    },
    billing: {
      web: {
        port: parseInt(process.env.BILLING_PORT, 10),
      },
      transport: {
        rabbitmq: {
          name: TransportAdapterNames.TransportBillingAdapterService,
          url: `amqp://${process.env.BILLING_RABBITMQ_USERNAME}:${
            process.env.BILLING_RABBITMQ_PASSWORD
          }@${process.env.BILLING_RABBITMQ_HOST}:${parseInt(
            process.env.BILLING_RABBITMQ_PORT,
            10,
          )}`,
          host: process.env.BILLING_RABBITMQ_HOST,
          port: parseInt(process.env.BILLING_RABBITMQ_PORT, 10),
          queue: process.env.BILLING_RABBITMQ_QUEUE,
          username: process.env.BILLING_RABBITMQ_USERNAME,
          password: process.env.BILLING_RABBITMQ_PASSWORD,
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },
      database: {
        postgres: {
          driver: process.env.BILLING_DATABASE_DRIVER,
          host: process.env.BILLING_DATABASE_HOST,
          port: parseInt(process.env.BILLING_DATABASE_PORT, 10),
          name: process.env.BILLING_DATABASE_NAME,
          username: process.env.BILLING_DATABASE_USERNAME,
          password: process.env.BILLING_DATABASE_PASSWORD,
        },
      },
    },
    processor: {
      web: {
        port: parseInt(process.env.PROCESSOR_PORT, 10),
      },
      transport: {
        rabbitmq: {
          name: TransportAdapterNames.TransportProcessorAdapterService,
          url: `amqp://${process.env.PROCESSOR_RABBITMQ_USERNAME}:${
            process.env.PROCESSOR_RABBITMQ_PASSWORD
          }@${process.env.PROCESSOR_RABBITMQ_HOST}:${parseInt(
            process.env.PROCESSOR_RABBITMQ_PORT,
            10,
          )}`,
          host: process.env.PROCESSOR_RABBITMQ_HOST,
          port: parseInt(process.env.PROCESSOR_RABBITMQ_PORT, 10),
          queue: process.env.PROCESSOR_RABBITMQ_QUEUE,
          username: process.env.PROCESSOR_RABBITMQ_USERNAME,
          password: process.env.PROCESSOR_RABBITMQ_PASSWORD,
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },
      database: {
        postgres: {
          driver: process.env.PROCESSOR_DATABASE_DRIVER,
          host: process.env.PROCESSOR_DATABASE_HOST,
          port: parseInt(process.env.PROCESSOR_DATABASE_PORT, 10),
          name: process.env.PROCESSOR_DATABASE_NAME,
          username: process.env.PROCESSOR_DATABASE_USERNAME,
          password: process.env.PROCESSOR_DATABASE_PASSWORD,
        },
      },
    },
    scheduler: {
      web: {
        port: parseInt(process.env.SCHEDULER_PORT, 10),
      },
      transport: {
        rabbitmq: {
          name: TransportAdapterNames.TransportSchedulerAdapterService,
          url: `amqp://${process.env.SCHEDULER_RABBITMQ_USERNAME}:${
            process.env.SCHEDULER_RABBITMQ_PASSWORD
          }@${process.env.SCHEDULER_RABBITMQ_HOST}:${parseInt(
            process.env.SCHEDULER_RABBITMQ_PORT,
            10,
          )}`,
          host: process.env.SCHEDULER_RABBITMQ_HOST,
          port: parseInt(process.env.SCHEDULER_RABBITMQ_PORT, 10),
          queue: process.env.SCHEDULER_RABBITMQ_QUEUE,
          username: process.env.SCHEDULER_RABBITMQ_USERNAME,
          password: process.env.SCHEDULER_RABBITMQ_PASSWORD,
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },
      database: {
        postgres: {
          driver: process.env.SCHEDULER_DATABASE_DRIVER,
          host: process.env.SCHEDULER_DATABASE_HOST,
          port: parseInt(process.env.SCHEDULER_DATABASE_PORT, 10),
          name: process.env.SCHEDULER_DATABASE_NAME,
          username: process.env.SCHEDULER_DATABASE_USERNAME,
          password: process.env.SCHEDULER_DATABASE_PASSWORD,
        },
      },
    },
    notifications: {
      web: {
        port: parseInt(process.env.NOTIFICATIONS_PORT, 10),
      },
      transport: {
        rabbitmq: {
          name: TransportAdapterNames.TransportNotificationsAdapterService,
          url: `amqp://${process.env.NOTIFICATIONS_RABBITMQ_USERNAME}:${
            process.env.NOTIFICATIONS_RABBITMQ_PASSWORD
          }@${process.env.NOTIFICATIONS_RABBITMQ_HOST}:${parseInt(
            process.env.NOTIFICATIONS_RABBITMQ_PORT,
            10,
          )}`,
          host: process.env.NOTIFICATIONS_RABBITMQ_HOST,
          port: parseInt(process.env.NOTIFICATIONS_RABBITMQ_PORT, 10),
          queue: process.env.NOTIFICATIONS_RABBITMQ_QUEUE,
          username: process.env.NOTIFICATIONS_RABBITMQ_USERNAME,
          password: process.env.NOTIFICATIONS_RABBITMQ_PASSWORD,
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },
      database: {
        postgres: {
          driver: process.env.NOTIFICATIONS_DATABASE_DRIVER,
          host: process.env.NOTIFICATIONS_DATABASE_HOST,
          port: parseInt(process.env.NOTIFICATIONS_DATABASE_PORT, 10),
          name: process.env.NOTIFICATIONS_DATABASE_NAME,
          username: process.env.NOTIFICATIONS_DATABASE_USERNAME,
          password: process.env.NOTIFICATIONS_DATABASE_PASSWORD,
        },
      },
    },
  },
});
