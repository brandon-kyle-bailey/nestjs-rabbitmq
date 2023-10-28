import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNotificationIntegrationQuery } from 'apps/gateway/src/interface/queries/notification-integration/get-notification-integration.query';
import { NotificationIntegrationEntity } from '../../../domain/entities/notification-integration.entity';
import { NotificationIntegrationRepository } from '../../ports/notification-integration/notification-integration.repository';
import { NotificationIntegrationRepositoryPort } from '../../ports/notification-integration/notification-integration.repository.port';

@QueryHandler(GetNotificationIntegrationQuery)
export class GetNotificationIntegrationService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(NotificationIntegrationRepository)
    protected readonly repo: NotificationIntegrationRepositoryPort,
  ) {}
  async execute(
    query: GetNotificationIntegrationQuery,
  ): Promise<NotificationIntegrationEntity> {
    try {
      return await this.repo.findOneById(query.id);
    } catch (error) {
      this.logger.error(
        'GetNotificationIntegrationService.execute encountered an error',
        error,
      );
    }
  }
}
