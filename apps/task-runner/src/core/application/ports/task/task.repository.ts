import { Injectable, Logger } from '@nestjs/common';
import { TaskRepositoryPort } from './task.repository.port';
import { PaginatedQueryParams, Paginated } from 'libs/ports/repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepositoryEntity } from './task.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskEntity } from '../../../domain/entities/task.entity';
import { TaskMapper } from 'apps/task-runner/src/infrastructure/mappers/task.mapper';

@Injectable()
export class TaskRepository implements TaskRepositoryPort {
  constructor(
    @InjectRepository(TaskRepositoryEntity)
    protected readonly repo: Repository<TaskRepositoryEntity>,
    protected readonly mapper: TaskMapper,
    protected readonly logger: Logger,
    private eventEmitter: EventEmitter2,
  ) {}

  async save(entity: TaskEntity): Promise<void> {
    await this.repo.save(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async insert(entity: TaskEntity): Promise<void> {
    const result = await this.repo.insert(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async findOneById(id: string): Promise<TaskEntity> {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async findAll(): Promise<TaskEntity[]> {
    const result = await this.repo.find();
    if (!result) {
      return null;
    }
    return result.map((record) => this.mapper.toDomain(record));
  }
  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<TaskEntity>> {
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
  async delete(entity: TaskEntity): Promise<boolean> {
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
