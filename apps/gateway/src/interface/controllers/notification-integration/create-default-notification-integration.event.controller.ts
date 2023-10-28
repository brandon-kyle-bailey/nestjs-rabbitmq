import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { NotificationIntegrationMapper } from 'apps/gateway/src/infrastructure/mappers/notification-integration.mapper';
import { NotificationIntegrationResponseDto } from '../../dtos/notification-integration/notification-integration.response.dto';
import { CreateNotificationIntegrationCommand } from '../../commands/notification-integration/create-notification-integration.command';
import { OnEvent } from '@nestjs/event-emitter';
import { Payload } from '@nestjs/microservices';
import { CreateDefaultNotificationIntegrationEventRequestDto } from '../../dtos/notification-integration/create-default-notification-integration.event.request.dto';
import { WorkspaceMembershipCreatedDomainEvent } from 'apps/gateway/src/core/domain/entities/workspace-membership.entity';
import { NotificationGenerics } from 'libs/common/enum/notification-generics.enum';

@Controller()
export class CreateDefaultNotificationIntegrationEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: NotificationIntegrationMapper,
  ) {}

  @OnEvent(WorkspaceMembershipCreatedDomainEvent.name)
  async create(
    @Payload() payload: CreateDefaultNotificationIntegrationEventRequestDto,
  ): Promise<NotificationIntegrationResponseDto> {
    try {
      if (!payload.receiveDefaultNotifications) {
        this.logger.debug(
          'not created default notification as preference is set to false',
        );
      }
      const command = CreateNotificationIntegrationCommand.create({
        ownerId: payload.userId,
        name: 'default',
        type: NotificationGenerics.Email,
        url: '',
        token: '',
        active: true,
      });
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreateDefaultNotificationIntegrationEventController.create encountered an error',
        error,
      );
    }
  }
}
