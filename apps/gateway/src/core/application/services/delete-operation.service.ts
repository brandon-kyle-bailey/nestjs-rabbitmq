import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OperationRepositoryPort } from '../ports/operation/operation.repository.port';
import { OperationRepository } from '../ports/operation/operation.repository';
import { DeleteOperationCommand } from 'apps/gateway/src/interface/commands/delete-operation.command';
import { AggregateID } from 'libs/ddd/entity.base';

@CommandHandler(DeleteOperationCommand)
export class DeleteOperationService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(OperationRepository)
    protected readonly operationRepository: OperationRepositoryPort,
  ) {}
  async execute(command: DeleteOperationCommand): Promise<AggregateID> {
    try {
      await this.operationRepository.transaction(async () => {
        const operation = await this.operationRepository.findOneById(
          command.id,
        );
        operation.delete();
        await this.operationRepository.delete(operation);
      });
      return command.id;
    } catch (error) {
      this.logger.error(
        'DeleteOperationService.execute encountered an error',
        error,
      );
    }
  }
}
