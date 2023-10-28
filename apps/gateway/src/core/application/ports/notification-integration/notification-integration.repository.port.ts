import { RepositoryPort } from 'libs/ports/repository.port';
import { NotificationIntegrationEntity } from '../../../domain/entities/notification-integration.entity';

export interface NotificationIntegrationRepositoryPort
  extends RepositoryPort<NotificationIntegrationEntity> {}
