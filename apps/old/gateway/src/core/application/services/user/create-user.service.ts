import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from 'apps/gateway/src/interface/commands/user/create-user.command';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(UserRepository)
    protected readonly repo: UserRepositoryPort,
  ) {}
  async execute(command: CreateUserCommand): Promise<UserEntity> {
    try {
      const user = UserEntity.create({
        name: command.name,
        email: command.email,
        password: command.password,
      });
      await this.repo.transaction(async () => this.repo.insert(user));
      return user;
    } catch (error) {
      this.logger.error(
        'CreateUserService.execute encountered an error',
        error,
      );
    }
  }
}
