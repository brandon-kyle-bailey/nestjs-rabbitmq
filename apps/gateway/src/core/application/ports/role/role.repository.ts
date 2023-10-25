import { Injectable, Logger } from '@nestjs/common';
import { RoleRepositoryPort } from './role.repository.port';
import { PaginatedQueryParams, Paginated } from 'libs/ports/repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoleRepositoryEntity } from './role.entity';
import { RoleEntity } from '../../../domain/entities/role.entity';
import { RoleMapper } from 'apps/gateway/src/infrastructure/mappers/role.mapper';

@Injectable()
export class RoleRepository implements RoleRepositoryPort {
  constructor(
    @InjectRepository(RoleRepositoryEntity)
    protected readonly repo: Repository<RoleRepositoryEntity>,
    protected readonly mapper: RoleMapper,
    protected readonly logger: Logger,
    private eventEmitter: EventEmitter2,
  ) {}
  async findOneByName(name: string): Promise<RoleEntity> {
    const result = await this.repo.findOneBy({ name });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async save(entity: RoleEntity): Promise<void> {
    await this.repo.save(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async insert(entity: RoleEntity): Promise<void> {
    const result = await this.repo.insert(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async findOneById(id: string): Promise<RoleEntity> {
    const result = await this.repo.findOneBy({ id });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async findAll(): Promise<RoleEntity[]> {
    const result = await this.repo.find();
    if (!result) {
      return null;
    }
    return result.map((record) => this.mapper.toDomain(record));
  }
  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<RoleEntity>> {
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
  async delete(entity: RoleEntity): Promise<boolean> {
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
