import { RepositoryPort } from 'libs/ports/repository.port';
import { ScheduledTaskEntity } from '../../../domain/entities/scheduled-task.entity';

export interface ScheduledTaskRepositoryPort
  extends RepositoryPort<ScheduledTaskEntity> {}
