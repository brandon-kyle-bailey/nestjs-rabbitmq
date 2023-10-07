import { Transport } from '@nestjs/microservices';
import configuration from 'libs/config/configuration';

const {
  services: {
    gateway: {
      transport: {
        rabbitmq: {
          name,
          url,
          queueOptions,
          gateways: { processor },
        },
      },
    },
  },
} = configuration();

export const adapters = [
  {
    name: name,
    useFactory: async () => {
      return {
        transport: Transport.RMQ,
        options: {
          urls: [url],
          queue: processor,
          queueOptions,
          noAck: true,
        },
      };
    },
  },
];
