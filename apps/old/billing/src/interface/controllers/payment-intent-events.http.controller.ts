import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import { AdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import configuration from 'libs/config/configuration';
import Stripe from 'stripe';

const {
  services: {
    billing: {
      web: { stripe_webhook_token: secret },
    },
  },
} = configuration();

@Controller('v1')
export class PaymentIntentEventsController {
  constructor(
    protected readonly logger: Logger,
    @Inject(AdapterNames.StripeClientAdapterService)
    private readonly adapter: Stripe,
  ) {}

  @Post('payment-intent-events')
  async receive(@Body() body: any, @Req() request: any): Promise<any> {
    try {
      switch (body.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = body.data.object;
          this.logger.debug(
            `PaymentIntent for ${paymentIntent.amount} was successful!`,
          );
          break;
        case 'payment_method.attached':
          const paymentMethod = body.data.object;
          break;
        default:
          this.logger.debug(`Unhandled body type ${body.type}.`);
      }
      return;
    } catch (error) {
      this.logger.error(
        'PaymentIntentEventsController.receive encountered an error',
        error,
      );
      throw new BadRequestException(error);
    }
  }
}
