import { RepositoryPort } from 'libs/ports/repository.port';
import { ScheduleEntity } from '../../../domain/entities/schedule.entity';

export interface ScheduleRepositoryPort extends RepositoryPort<ScheduleEntity> {
  findOneByOperationId(operationId: string): Promise<ScheduleEntity>;
  findAllActive(): Promise<ScheduleEntity[]>;
}
