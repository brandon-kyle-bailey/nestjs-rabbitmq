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
        secret: 'hawkstatus',
        access_token_refresh: process.env.AUTH_ACCESS_TOKEN_REFRESH,
        refresh_token_refresh: process.env.AUTH_REFRESH_TOKEN_REFRESH,
      },
      transport: {
        rabbitmq: {
          name: TransportAdapterNames.TransportAuthAdapterService,
          url: `amqp://${process.env.GATEWAY_RABBITMQ_USERNAME}:${
            process.env.GATEWAY_RABBITMQ_PASSWORD
          }@${process.env.GATEWAY_RABBITMQ_HOST}:${parseInt(
            process.env.GATEWAY_RABBITMQ_PORT,
            10,
          )}`,
          host: process.env.GATEWAY_RABBITMQ_HOST,
          port: parseInt(process.env.GATEWAY_RABBITMQ_PORT, 10),
          queue: process.env.AUTH_RABBITMQ_QUEUE,
          username: process.env.GATEWAY_RABBITMQ_USERNAME,
          password: process.env.GATEWAY_RABBITMQ_PASSWORD,
          queueOptions: {
            durable: true,
          },
          noAck: true,
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
    billing: {
      web: {
        port: parseInt(process.env.BILLING_PORT, 10),
        stripe_token: process.env.BILLING_STRIPE_SECRET_KEY,
        stripe_webhook_token: process.env.BILLING_STRIPE_WEBHOOK_SECRET_KEY,
      },
      transport: {
        rabbitmq: {
          name: TransportAdapterNames.TransportBillingAdapterService,
          url: `amqp://${process.env.GATEWAY_RABBITMQ_USERNAME}:${
            process.env.GATEWAY_RABBITMQ_PASSWORD
          }@${process.env.GATEWAY_RABBITMQ_HOST}:${parseInt(
            process.env.GATEWAY_RABBITMQ_PORT,
            10,
          )}`,
          host: process.env.GATEWAY_RABBITMQ_HOST,
          port: parseInt(process.env.GATEWAY_RABBITMQ_PORT, 10),
          queue: process.env.BILLING_RABBITMQ_QUEUE,
          username: process.env.GATEWAY_RABBITMQ_USERNAME,
          password: process.env.GATEWAY_RABBITMQ_PASSWORD,
          queueOptions: {
            durable: true,
          },
          noAck: true,
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
    task_runner: {
      web: {
        port: parseInt(process.env.PROCESSOR_PORT, 10),
      },
      transport: {
        rabbitmq: {
          name: TransportAdapterNames.TransportTaskRunnerAdapterService,
          url: `amqp://${process.env.GATEWAY_RABBITMQ_USERNAME}:${
            process.env.GATEWAY_RABBITMQ_PASSWORD
          }@${process.env.GATEWAY_RABBITMQ_HOST}:${parseInt(
            process.env.GATEWAY_RABBITMQ_PORT,
            10,
          )}`,
          host: process.env.GATEWAY_RABBITMQ_HOST,
          port: parseInt(process.env.GATEWAY_RABBITMQ_PORT, 10),
          queue: process.env.PROCESSOR_RABBITMQ_QUEUE,
          username: process.env.GATEWAY_RABBITMQ_USERNAME,
          password: process.env.GATEWAY_RABBITMQ_PASSWORD,
          queueOptions: {
            durable: true,
          },
          noAck: true,
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
    schedule_orchestrator: {
      web: {
        port: parseInt(process.env.SCHEDULER_PORT, 10),
      },
      transport: {
        rabbitmq: {
          name: TransportAdapterNames.TransportSchedulerAdapterService,
          url: `amqp://${process.env.GATEWAY_RABBITMQ_USERNAME}:${
            process.env.GATEWAY_RABBITMQ_PASSWORD
          }@${process.env.GATEWAY_RABBITMQ_HOST}:${parseInt(
            process.env.GATEWAY_RABBITMQ_PORT,
            10,
          )}`,
          host: process.env.GATEWAY_RABBITMQ_HOST,
          port: parseInt(process.env.GATEWAY_RABBITMQ_PORT, 10),
          queue: process.env.SCHEDULER_RABBITMQ_QUEUE,
          username: process.env.GATEWAY_RABBITMQ_USERNAME,
          password: process.env.GATEWAY_RABBITMQ_PASSWORD,
          queueOptions: {
            durable: true,
          },
          noAck: true,
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
    notifications: {
      web: {
        port: parseInt(process.env.NOTIFICATIONS_PORT, 10),
      },
      transport: {
        rabbitmq: {
          name: TransportAdapterNames.TransportNotificationsAdapterService,
          url: `amqp://${process.env.GATEWAY_RABBITMQ_USERNAME}:${
            process.env.GATEWAY_RABBITMQ_PASSWORD
          }@${process.env.GATEWAY_RABBITMQ_HOST}:${parseInt(
            process.env.GATEWAY_RABBITMQ_PORT,
            10,
          )}`,
          host: process.env.GATEWAY_RABBITMQ_HOST,
          port: parseInt(process.env.GATEWAY_RABBITMQ_PORT, 10),
          queue: process.env.NOTIFICATIONS_RABBITMQ_QUEUE,
          username: process.env.GATEWAY_RABBITMQ_USERNAME,
          password: process.env.GATEWAY_RABBITMQ_PASSWORD,
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
        smtp: {
          host: process.env.NOTIFICATIONS_SMTP_HOST,
          port: parseInt(process.env.NOTIFICATIONS_SMTP_PORT, 10),
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
  },
});
