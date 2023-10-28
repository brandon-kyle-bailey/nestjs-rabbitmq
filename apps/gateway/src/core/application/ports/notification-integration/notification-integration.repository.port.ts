import { RepositoryPort } from 'libs/ports/repository.port';
import { NotificationIntegrationEntity } from '../../../domain/entities/notification-integration.entity';
import { AggregateID } from 'libs/ddd/entity.base';

export interface NotificationIntegrationRepositoryPort
  extends RepositoryPort<NotificationIntegrationEntity> {
  findOneByName(
    name: string,
    ownerId: AggregateID,
  ): Promise<NotificationIntegrationEntity>;
}
