import { RepositoryPort } from 'libs/ports/repository.port';
import { ScheduleEntity } from '../../../domain/entities/schedule.entity';

export interface ScheduleRepositoryPort extends RepositoryPort<ScheduleEntity> {
  findOneByTaskId(taskId: string): Promise<ScheduleEntity>;
  findAllActive(): Promise<ScheduleEntity[]>;
}