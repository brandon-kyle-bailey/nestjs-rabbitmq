import { Injectable, Logger } from '@nestjs/common';
import { BillingPlanRepositoryPort } from './billing-plan.repository.port';
import { PaginatedQueryParams, Paginated } from 'libs/ports/repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BillingPlanRepositoryEntity } from './billing-plan.entity';
import { BillingPlanEntity } from '../../../domain/entities/billing-plan.entity';
import { BillingPlanMapper } from 'apps/gateway/src/infrastructure/mappers/billing-plan.mapper';

@Injectable()
export class BillingPlanRepository implements BillingPlanRepositoryPort {
  constructor(
    @InjectRepository(BillingPlanRepositoryEntity)
    protected readonly repo: Repository<BillingPlanRepositoryEntity>,
    protected readonly mapper: BillingPlanMapper,
    protected readonly logger: Logger,
    private eventEmitter: EventEmitter2,
  ) {}
  async findOneByName(name: string): Promise<BillingPlanEntity> {
    const result = await this.repo.findOneBy({ name });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async save(entity: BillingPlanEntity): Promise<void> {
    await this.repo.save(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async insert(entity: BillingPlanEntity): Promise<void> {
    const result = await this.repo.insert(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async findOneById(id: string): Promise<BillingPlanEntity> {
    const result = await this.repo.findOneBy({ id });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async findAll(): Promise<BillingPlanEntity[]> {
    const result = await this.repo.find();
    if (!result) {
      return null;
    }
    return result.map((record) => this.mapper.toDomain(record));
  }
  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<BillingPlanEntity>> {
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
  async delete(entity: BillingPlanEntity): Promise<boolean> {
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
