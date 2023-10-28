import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { SendVerificationEmailCommand } from 'apps/gateway/src/interface/commands/user/send-verification-email.command';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { NotificationsIntegrationEvents } from 'libs/events/notifications.events';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';
import { finalize, firstValueFrom } from 'rxjs';
import { NotificationGenerics } from 'libs/common/enum/notification-generics.enum';

@CommandHandler(SendVerificationEmailCommand)
export class SendVerificationEmailService
  implements ICommandHandler, OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly logger: Logger,
    @Inject(TransportAdapterNames.TransportNotificationsAdapterService)
    private readonly service: ClientProxy,
    @Inject(UserRepository)
    private readonly repo: UserRepositoryPort,
  ) {}
  async onModuleInit() {
    await this.service.connect();
  }
  async onModuleDestroy() {
    await this.service.close();
  }
  async execute(command: SendVerificationEmailCommand): Promise<void> {
    try {
      const user = await this.repo.findOneByEmail(command.email);
      const payload = {
        to: command.email,
        subject: `Please verify your email!`,
        text: `Hey ${command.name}, Please verify your email address by clicking the link below. http://localhost:3000/v1/user/verify?id=${user.id}`,
      };
      this.service
        .send(
          `${NotificationsIntegrationEvents.SendPrefix}.${NotificationGenerics.Email}`,
          payload,
        )
        .subscribe();
    } catch (error) {
      this.logger.error(
        'SendVerificationEmailService.execute encountered an error',
        error,
      );
    }
  }
}
