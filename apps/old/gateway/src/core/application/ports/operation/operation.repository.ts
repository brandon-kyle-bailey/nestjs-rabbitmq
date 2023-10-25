import { Injectable, Logger } from '@nestjs/common';
import { OperationRepositoryPort } from './operation.repository.port';
import { PaginatedQueryParams, Paginated } from 'libs/ports/repository.port';
import { OperationEntity } from '../../../domain/entities/operation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OperationRepositoryEntity } from './operation.entity';
import { Repository } from 'typeorm';
import { OperationMapper } from 'apps/gateway/src/infrastructure/mappers/operation.mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class OperationRepository implements OperationRepositoryPort {
  constructor(
    @InjectRepository(OperationRepositoryEntity)
    protected readonly repo: Repository<OperationRepositoryEntity>,
    protected readonly mapper: OperationMapper,
    protected readonly logger: Logger,
    private eventEmitter: EventEmitter2,
  ) {}
  async save(entity: OperationEntity): Promise<void> {
    await this.repo.save(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async insert(entity: OperationEntity): Promise<void> {
    const result = await this.repo.insert(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async findOneById(id: string): Promise<OperationEntity> {
    const result = await this.repo.findOneBy({ id });
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async findAll(): Promise<OperationEntity[]> {
    const result = await this.repo.find();
    return result.map((record) => this.mapper.toDomain(record));
  }
  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<OperationEntity>> {
    const result = await this.repo.find({
      skip: params.offset,
      take: params.limit,
      order: { [String(params.orderBy.field)]: params.orderBy.param },
    });
    return new Paginated({
      count: result.length,
      limit: Number(params.limit),
      page: params.page,
      data: result.map((record) => this.mapper.toDomain(record)),
    });
  }
  async delete(entity: OperationEntity): Promise<boolean> {
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
