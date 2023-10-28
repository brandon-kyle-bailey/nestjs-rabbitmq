import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListNotificationIntegrationQuery } from 'apps/gateway/src/interface/queries/notification-integration/list-notification-integration.query';
import { Paginated } from 'libs/ports/repository.port';
import { NotificationIntegrationEntity } from '../../../domain/entities/notification-integration.entity';
import { NotificationIntegrationRepository } from '../../ports/notification-integration/notification-integration.repository';
import { NotificationIntegrationRepositoryPort } from '../../ports/notification-integration/notification-integration.repository.port';

@QueryHandler(ListNotificationIntegrationQuery)
export class ListNotificationIntegrationService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(NotificationIntegrationRepository)
    protected readonly repo: NotificationIntegrationRepositoryPort,
  ) {}
  async execute(
    query: ListNotificationIntegrationQuery,
  ): Promise<Paginated<NotificationIntegrationEntity>> {
    try {
      return await this.repo.findAllPaginated({
        limit: query.limit,
        page: query.page,
        offset: query.offset,
        orderBy: { field: 'createdAt', param: 'asc' },
      });
    } catch (error) {
      this.logger.error(
        'ListNotificationIntegrationsService.execute encountered an error',
        error,
      );
    }
  }
}
