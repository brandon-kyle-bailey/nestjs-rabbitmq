import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from 'apps/gateway/src/interface/commands/user/create-user.command';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';
import { firstValueFrom } from 'rxjs';
import { NotificationIntegrationEvents } from 'libs/events/notification.events';
import { ClientProxy } from '@nestjs/microservices';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(UserRepository)
    protected readonly repo: UserRepositoryPort,
    @Inject(TransportAdapterNames.TransportNotificationsAdapterService)
    private readonly service: ClientProxy,
  ) {}
  async onModuleInit() {
    await this.service.connect();
  }
  async onModuleDestroy() {
    await this.service.close();
  }
  async execute(command: CreateUserCommand): Promise<UserEntity> {
    try {
      const user = UserEntity.create({
        name: command.name,
        email: command.email,
        password: command.password,
      });
      this.logger.debug(user)
      await this.repo.transaction(async () => {
        this.repo.insert(user);
        await firstValueFrom(
          this.service.send(NotificationIntegrationEvents.SendEmail, {
            to: command.email, 
            subject: `Welcome ${command.name}`, 
            text: `Welcome to this awesome app ${command.name}!`
          }),
        );
      });
      this.logger.debug(user)
      return user;
    } catch (error) {
      this.logger.error(
        'CreateUserService.execute encountered an error',
        error,
      );
    }
  }
}
