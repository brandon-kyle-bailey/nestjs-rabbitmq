import { RepositoryPort } from 'libs/ports/repository.port';
import { ProcessEventEntity } from '../../../domain/entities/process-event.entity';

export interface ProcessEventRepositoryPort
  extends RepositoryPort<ProcessEventEntity> {
  findOneByOperationId(operationId: string): Promise<ProcessEventEntity>;
}
