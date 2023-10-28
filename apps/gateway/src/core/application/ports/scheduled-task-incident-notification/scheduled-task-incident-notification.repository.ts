import { Injectable, Logger } from '@nestjs/common';
import { PaginatedQueryParams, Paginated } from 'libs/ports/repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ScheduledTaskIncidentNotificationEntity } from '../../../domain/entities/scheduled-task-incident-notification.entity';
import { ScheduledTaskIncidentNotificationRepositoryEntity } from './scheduled-task-incident-notification.entity';
import { ScheduledTaskIncidentNotificationRepositoryPort } from './scheduled-task-incident-notification.repository.port';
import { ScheduledTaskIncidentNotificationMapper } from 'apps/gateway/src/infrastructure/mappers/scheduled-task-incident-notification.mapper';

@Injectable()
export class ScheduledTaskIncidentNotificationRepository
  implements ScheduledTaskIncidentNotificationRepositoryPort
{
  constructor(
    @InjectRepository(ScheduledTaskIncidentNotificationRepositoryEntity)
    protected readonly repo: Repository<ScheduledTaskIncidentNotificationRepositoryEntity>,
    protected readonly mapper: ScheduledTaskIncidentNotificationMapper,
    protected readonly logger: Logger,
    private eventEmitter: EventEmitter2,
  ) {}
  async findAllByScheduledTaskIdAndStatusPrefix(
    scheduledTaskId: string,
    statusPrefix: number,
  ): Promise<ScheduledTaskIncidentNotificationEntity[]> {
    const result = await this.repo.find({
      where: { scheduledTaskId, statusPrefix, notify: true },
      relations: {
        notificationIntegration: true,
      },
    });
    if (!result) {
      return null;
    }
    return result.map((record) => this.mapper.toDomain(record));
  }
  async save(entity: ScheduledTaskIncidentNotificationEntity): Promise<void> {
    await this.repo.save(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async insert(entity: ScheduledTaskIncidentNotificationEntity): Promise<void> {
    const result = await this.repo.insert(this.mapper.toPersistence(entity));
    return await entity.publishEvents(this.logger, this.eventEmitter);
  }
  async findOneById(
    id: string,
  ): Promise<ScheduledTaskIncidentNotificationEntity> {
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
  async findAll(): Promise<ScheduledTaskIncidentNotificationEntity[]> {
    const result = await this.repo.find();
    if (!result) {
      return null;
    }
    return result.map((record) => this.mapper.toDomain(record));
  }
  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<ScheduledTaskIncidentNotificationEntity>> {
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
  async delete(
    entity: ScheduledTaskIncidentNotificationEntity,
  ): Promise<boolean> {
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
