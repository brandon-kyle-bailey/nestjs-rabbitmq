import { RepositoryPort } from 'libs/ports/repository.port';
import { TaskEntity } from '../../../domain/entities/task.entity';

export interface TaskRepositoryPort extends RepositoryPort<TaskEntity> {}
