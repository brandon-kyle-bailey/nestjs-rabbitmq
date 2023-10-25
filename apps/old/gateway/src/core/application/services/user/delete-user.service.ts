import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from 'apps/gateway/src/interface/commands/user/delete-user.command';
import { AggregateID } from 'libs/ddd/entity.base';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';

@CommandHandler(DeleteUserCommand)
export class DeleteUserService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(UserRepository)
    protected readonly repo: UserRepositoryPort,
  ) {}
  async execute(command: DeleteUserCommand): Promise<AggregateID> {
    try {
      await this.repo.transaction(async () => {
        const User = await this.repo.findOneById(command.id);
        User.delete();
        await this.repo.delete(User);
      });
      return command.id;
    } catch (error) {
      this.logger.error(
        'DeleteUserService.execute encountered an error',
        error,
      );
    }
  }
}
