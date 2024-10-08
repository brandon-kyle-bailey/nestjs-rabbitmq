import { Transport } from '@nestjs/microservices';
import configuration from 'libs/config/configuration';

const {
  services: {
    notifications: {
      transport: {
        rabbitmq: { name, url, queue, queueOptions },
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
          queue: queue,
          queueOptions,
        },
      };
    },
  },
];
