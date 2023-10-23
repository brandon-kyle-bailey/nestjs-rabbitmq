import { AdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import configuration from 'libs/config/configuration';
import Stripe from 'stripe';

const {
  services: {
    billing: {
      web: { stripe_token },
    },
  },
} = configuration();

const dataSource = new Stripe(stripe_token, { apiVersion: '2023-10-16' });

export const adapters = [
  {
    provide: AdapterNames.StripeClientAdapterService,
    useFactory: async () => dataSource,
  },
];
