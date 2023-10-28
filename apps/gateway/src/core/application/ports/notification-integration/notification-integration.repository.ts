import { Injectable, Logger } from '@nestjs/common';
import { PaginatedQueryParams, Paginated } from 'libs/ports/repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationIntegrationRepositoryEntity } from './notification-integration.entity';
import { NotificationIntegrationRepositoryPort } from './notification-integration.repository.port';
import { NotificationIntegrationEntity } from '../../../domain/entities/notification-integration.entity';
import { NotificationIntegrationMapper } from 'apps/gateway/src/infrastructure/mappers/notification-integration.mapper';

@Injectable()
export class NotificationIntegrationRepository
  implements NotificationIntegrationRepositoryPort
{
  constructor(
    @InjectRepository(NotificationIntegrationRepositoryEntity)
    protected readonly repo: Repository<NotificationIntegrationRepositoryEntity>,
    protected readonly mapper: NotificationIntegrationMapper,
    protected readonly logger: Logger,
    private eventEmitter: EventEmitter2,
  ) {}
  async save(entity: NotificationIntegrationEntity): Promise<void> {
    await this.repo.save(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async insert(entity: NotificationIntegrationEntity): Promise<void> {
    const result = await this.repo.insert(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async findOneById(id: string): Promise<NotificationIntegrationEntity> {
    const result = await this.repo.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!result) {
      return null;
    }
    const entity = this.mapper.toDomain(result);
    return entity;
  }
  async findAll(): Promise<NotificationIntegrationEntity[]> {
    const result = await this.repo.find();
    if (!result) {
      return null;
    }
    return result.map((record) => this.mapper.toDomain(record));
  }
  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<NotificationIntegrationEntity>> {
    const result = await this.repo.find({
      skip: params.offset,
      take: params.limit,
      order: { [String(params.orderBy.field)]: params.orderBy.param },
      where: params.filter,
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
  async delete(entity: NotificationIntegrationEntity): Promise<boolean> {
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
