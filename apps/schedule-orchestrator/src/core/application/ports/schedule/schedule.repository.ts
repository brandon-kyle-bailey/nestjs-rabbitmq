import { Injectable, Logger } from '@nestjs/common';
import { ScheduleRepositoryPort } from './schedule.repository.port';
import { PaginatedQueryParams, Paginated } from 'libs/ports/repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleRepositoryEntity } from './schedule.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ScheduleEntity } from '../../../domain/entities/schedule.entity';
import { ScheduleMapper } from 'apps/schedule-orchestrator/src/infrastructure/mappers/schedule.mapper';

@Injectable()
export class ScheduleRepository implements ScheduleRepositoryPort {
  constructor(
    @InjectRepository(ScheduleRepositoryEntity)
    protected readonly repo: Repository<ScheduleRepositoryEntity>,
    protected readonly mapper: ScheduleMapper,
    protected readonly logger: Logger,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAllActive(): Promise<ScheduleEntity[]> {
    const result = await this.repo.findBy({ active: true });
    return result.map((record) => this.mapper.toDomain(record));
  }
  async findOneByTaskId(taskId: string): Promise<ScheduleEntity> {
    const result = await this.repo.findOne({
      where: { scheduledTaskId: taskId },
    });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async save(entity: ScheduleEntity): Promise<void> {
    await this.repo.save(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async insert(entity: ScheduleEntity): Promise<void> {
    const result = await this.repo.insert(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async findOneById(id: string): Promise<ScheduleEntity> {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async findAll(): Promise<ScheduleEntity[]> {
    const result = await this.repo.find();
    if (!result) {
      return null;
    }
    return result.map((record) => this.mapper.toDomain(record));
  }
  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<ScheduleEntity>> {
    const result = await this.repo.find({
      skip: params.offset,
      take: params.limit,
      order: { [String(params.orderBy.field)]: params.orderBy.param },
    });
    if (!result) {
      return null;
    }
    return new Paginated({
      count: result.length,
      limit: Number(params.limit),
      page: params.page,
      data: result.map((record) => this.mapper.toDomain(record)),
    });
  }
  async delete(entity: ScheduleEntity): Promise<boolean> {
    const result = await this.repo.softDelete(entity.id);
    if (result) {
      await entity.publishEvents(this.logger, this.eventEmitter);
      return true;
    }
    return false;
  }
  async transaction<T>(handler: () => Promise<T>): Promise<T> {
    return await handler();
  }
}
