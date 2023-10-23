import { Controller, Logger, Inject } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import Stripe from 'stripe';
import { AdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { BillingIntegrationEvents } from 'libs/events/billing.events';
import { CreatePaymentIntentRequestDto } from '../dtos/create-payment-intent.request.dto';

@Controller()
export class CreatePaymentIntentEventController {
  constructor(
    protected readonly logger: Logger,
    @Inject(AdapterNames.StripeClientAdapterService)
    private readonly adapter: Stripe,
  ) {}

  @EventPattern(BillingIntegrationEvents.CreatePaymentIntent)
  async create(
    @Payload() payload: CreatePaymentIntentRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<string> {
    try {
      const paymentIntent = await this.adapter.paymentIntents.create({
        amount: payload.amount,
        currency: payload.currency,
      });
      return paymentIntent.client_secret;
    } catch (error) {
      this.logger.error(
        'CreatePaymentIntentEventController.create encountered an error',
        error,
      );
    }
  }
}
