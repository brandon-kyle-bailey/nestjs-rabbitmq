import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OperationEntity } from '../../domain/entities/operation.entity';
import { OperationRepositoryPort } from '../ports/operation/operation.repository.port';
import { OperationRepository } from '../ports/operation/operation.repository';
import { UpdateOperationCommand } from 'apps/gateway/src/interface/commands/update-operation.command';

@CommandHandler(UpdateOperationCommand)
export class UpdateOperationService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(OperationRepository)
    protected readonly repo: OperationRepositoryPort,
  ) {}
  async execute(command: UpdateOperationCommand): Promise<OperationEntity> {
    try {
      let operation: OperationEntity;
      await this.repo.transaction(async () => {
        operation = await this.repo.findOneById(command.id);
        operation.update(command);
        this.repo.save(operation);
      });
      return operation;
    } catch (error) {
      this.logger.error(
        'UpdateOperationService.execute encountered an error',
        error,
      );
    }
  }
}
