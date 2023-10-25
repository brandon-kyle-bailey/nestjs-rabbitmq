import { RepositoryPort } from 'libs/ports/repository.port';
import { OperationEntity } from '../../../domain/entities/operation.entity';

export interface OperationRepositoryPort
  extends RepositoryPort<OperationEntity> {}
