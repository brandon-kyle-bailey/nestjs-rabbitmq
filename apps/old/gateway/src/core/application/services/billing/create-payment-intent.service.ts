import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePaymentIntentCommand } from 'apps/gateway/src/interface/commands/billing/create-payment-intent.command';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { BillingIntegrationEvents } from 'libs/events/billing.events';
import { firstValueFrom } from 'rxjs';

@CommandHandler(CreatePaymentIntentCommand)
export class CreatePaymentIntentService
  implements ICommandHandler, OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly logger: Logger,
    @Inject(TransportAdapterNames.TransportBillingAdapterService)
    private readonly service: ClientProxy,
  ) {}
  async onModuleInit() {
    await this.service.connect();
  }
  async onModuleDestroy() {
    await this.service.close();
  }
  async execute(command: CreatePaymentIntentCommand): Promise<string> {
    try {
      const payload = await firstValueFrom(
        this.service.send(BillingIntegrationEvents.CreatePaymentIntent, {
          amount: command.amount,
          currency: command.currency,
        }),
      );
      this.logger.debug(payload);
      return payload;
    } catch (error) {
      this.logger.error(
        'CreatePaymentIntentService.execute encountered an error',
        error,
      );
    }
  }
}
