import { RepositoryPort } from 'libs/ports/repository.port';
import { WorkspaceMembershipEntity } from '../../../domain/entities/workspace-membership.entity';
import { AggregateID } from 'libs/ddd/entity.base';

export interface WorkspaceMembershipRepositoryPort
  extends RepositoryPort<WorkspaceMembershipEntity> {
  findAllByUserId(
    userId: AggregateID,
  ): Promise<Array<WorkspaceMembershipEntity>>;
}
