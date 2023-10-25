import { RepositoryPort } from 'libs/ports/repository.port';
import { WorkspaceEntity } from '../../../domain/entities/workspace.entity';

export interface WorkspaceRepositoryPort
  extends RepositoryPort<WorkspaceEntity> {}
