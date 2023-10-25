import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from 'apps/gateway/src/interface/commands/user/update-user.command';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';

@CommandHandler(UpdateUserCommand)
export class UpdateUserService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(UserRepository)
    protected readonly repo: UserRepositoryPort,
  ) {}
  async execute(command: UpdateUserCommand): Promise<UserEntity> {
    try {
      let user: UserEntity;
      await this.repo.transaction(async () => {
        user = await this.repo.findOneById(command.userId);
        user.update(command);
        this.repo.save(user);
      });
      return user;
    } catch (error) {
      this.logger.error(
        'UpdateUserService.execute encountered an error',
        error,
      );
    }
  }
}
