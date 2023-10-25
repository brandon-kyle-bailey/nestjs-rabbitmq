import { Injectable, Logger } from '@nestjs/common';
import { PaginatedQueryParams, Paginated } from 'libs/ports/repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProcessEventEntity } from '../../../domain/entities/process-event.entity';
import { ProcessEventRepositoryEntity } from './process-event.entity';
import { ProcessEventRepositoryPort } from './process-event.repository.port';
import { ProcessEventMapper } from 'apps/processor/src/infrastructure/mappers/process-event.mapper';

@Injectable()
export class ProcessEventRepository implements ProcessEventRepositoryPort {
  constructor(
    @InjectRepository(ProcessEventRepositoryEntity)
    protected readonly repo: Repository<ProcessEventRepositoryEntity>,
    protected readonly logger: Logger,
    protected readonly mapper: ProcessEventMapper,
    private eventEmitter: EventEmitter2,
  ) {}
  async save(entity: ProcessEventEntity): Promise<void> {
    await this.repo.save(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async insert(entity: ProcessEventEntity): Promise<void> {
    const persistenceModel = this.mapper.toPersistence(entity);
    const result = await this.repo.insert(persistenceModel);
    await entity.publishEvents(this.logger, this.eventEmitter);
    return;
  }
  async findOneById(id: string): Promise<ProcessEventEntity> {
    const result = await this.repo.findOneBy({ id });
    const entity = this.mapper.toDomain(result);
    return entity;
  }

  async findOneByOperationId(operationId: string): Promise<ProcessEventEntity> {
    const result = await this.repo.findOneBy({ operationId });
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async findAll(): Promise<ProcessEventEntity[]> {
    const result = await this.repo.find();
    return result.map((record) => this.mapper.toDomain(record));
  }
  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<ProcessEventEntity>> {
    const result = await this.repo.find({
      skip: params.offset,
      take: params.limit,
      order: { [String(params.orderBy.field)]: params.orderBy.param },
    });
    return new Paginated({
      count: result.length,
      limit: result.length,
      page: params.page,
      data: result.map((record) => this.mapper.toDomain(record)),
    });
  }
  async delete(entity: ProcessEventEntity): Promise<boolean> {
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
