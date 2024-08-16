import configuration from 'libs/config/configuration';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { MailerOptions } from '@nestjs-modules/mailer';

const {
  services: { notifications },
} = configuration();

export const config: MailerOptions = {
  transport: {
    host: 'localhost',
    port: 1025,
    secure: false,
    auth: {
      user: 'user@example.com',
      pass: 'topsecret',
    },
  },
  defaults: {
    from: '"No Reply" <noreply@example.com>',
  },
  template: {
    dir: join(__dirname, 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};

export const adapters = [
  {
    provide: TransportAdapterNames.TransportSmtpAdapterService,
    useFactory: async () => {
      return config;
    },
  },
];
