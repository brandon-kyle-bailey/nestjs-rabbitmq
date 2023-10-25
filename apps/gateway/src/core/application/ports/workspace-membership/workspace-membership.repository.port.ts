import { RepositoryPort } from 'libs/ports/repository.port';
import { WorkspaceMembershipEntity } from '../../../domain/entities/workspace-membership.entity';

export interface WorkspaceMembershipRepositoryPort
  extends RepositoryPort<WorkspaceMembershipEntity> {}
