import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OperationEntity } from '../../../domain/entities/operation.entity';
import { OperationRepositoryPort } from '../../ports/operation/operation.repository.port';
import { OperationRepository } from '../../ports/operation/operation.repository';
import { CreateOperationCommand } from 'apps/gateway/src/interface/commands/operation/create-operation.command';

@CommandHandler(CreateOperationCommand)
export class CreateOperationService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(OperationRepository)
    protected readonly operationRepository: OperationRepositoryPort,
  ) {}
  async execute(command: CreateOperationCommand): Promise<OperationEntity> {
    try {
      const operation = OperationEntity.create({
        name: command.name,
        protocol: command.protocol,
        host: command.host,
        port: command.port,
        interval: command.interval,
      });
      await this.operationRepository.transaction(async () =>
        this.operationRepository.insert(operation),
      );
      return operation;
    } catch (error) {
      this.logger.error(
        'CreateOperationService.execute encountered an error',
        error,
      );
    }
  }
}
