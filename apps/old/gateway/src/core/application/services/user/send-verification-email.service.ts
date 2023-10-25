import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { SendVerificationEmailCommand } from 'apps/gateway/src/interface/commands/user/send-verification-email.command';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { NotificationsIntegrationEvents } from 'libs/events/notifications.events';

@CommandHandler(SendVerificationEmailCommand)
export class SendVerificationEmailService
  implements ICommandHandler, OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly logger: Logger,
    @Inject(TransportAdapterNames.TransportNotificationsAdapterService)
    private readonly service: ClientProxy,
  ) {}
  async onModuleInit() {
    await this.service.connect();
  }
  async onModuleDestroy() {
    await this.service.close();
  }
  async execute(command: SendVerificationEmailCommand): Promise<void> {
    try {
      await Promise.resolve(
        this.service.send(NotificationsIntegrationEvents.SendEmail, {
          to: command.email,
          subject: `Please verify your email!`,
          text: `Hey ${command.name}, Please verify your email address`,
        }),
      );
    } catch (error) {
      this.logger.error(
        'SendVerificationEmailService.execute encountered an error',
        error,
      );
    }
  }
}
