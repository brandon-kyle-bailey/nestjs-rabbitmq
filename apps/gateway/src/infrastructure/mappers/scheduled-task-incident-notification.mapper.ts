import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { UserMapper } from './user.mapper';
import { ScheduledTaskIncidentNotificationRepositoryEntity } from '../../core/application/ports/scheduled-task-incident-notification/scheduled-task-incident-notification.entity';
import { ScheduledTaskIncidentNotificationEntity } from '../../core/domain/entities/scheduled-task-incident-notification.entity';
import { ScheduledTaskMapper } from './scheduled-task.mapper';
import { ScheduledTaskIncidentNotificationResponseDto } from '../../interface/dtos/scheduled-task-incident-notification/scheduled-task-incident-notification.response.dto';
import { NotificationIntegrationMapper } from './notification-integration.mapper';
import { NotificationIntegrationResponseDto } from '../../interface/dtos/notification-integration/notification-integration.response.dto';
import { UserResponseDto } from '../../interface/dtos/user/user.response.dto';

@Injectable()
export class ScheduledTaskIncidentNotificationMapper
  implements
    Mapper<
      ScheduledTaskIncidentNotificationEntity,
      ScheduledTaskIncidentNotificationRepositoryEntity,
      ScheduledTaskIncidentNotificationResponseDto
    >
{
  toPersistence(
    entity: ScheduledTaskIncidentNotificationEntity,
  ): ScheduledTaskIncidentNotificationRepositoryEntity {
    return ScheduledTaskIncidentNotificationMapper.toPersistence(entity);
  }

  static toPersistence(
    entity: ScheduledTaskIncidentNotificationEntity,
  ): ScheduledTaskIncidentNotificationRepositoryEntity {
    const copy = entity.getProps();
    const record: ScheduledTaskIncidentNotificationRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      owner: copy.owner ? UserMapper.toPersistence(copy.owner) : undefined,
      ownerId: copy.owner.id,
      notify: copy.notify,
      scheduledTask: copy.scheduledTask
        ? ScheduledTaskMapper.toPersistence(copy.scheduledTask)
        : undefined,
      scheduledTaskId: copy.scheduledTask.id,
      statusPrefix: copy.statusPrefix,
      notificationIntegrationId: copy.notificationIntegration.id,
      notificationIntegration: copy.notificationIntegration
        ? NotificationIntegrationMapper.toPersistence(
            copy.notificationIntegration,
          )
        : undefined,
    };
    return record;
  }

  toDomain(
    record: ScheduledTaskIncidentNotificationRepositoryEntity,
  ): ScheduledTaskIncidentNotificationEntity {
    return ScheduledTaskIncidentNotificationMapper.toDomain(record);
  }

  static toDomain(
    record: ScheduledTaskIncidentNotificationRepositoryEntity,
  ): ScheduledTaskIncidentNotificationEntity {
    const entity = new ScheduledTaskIncidentNotificationEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        ownerId: record.ownerId,
        owner: record.owner ? UserMapper.toDomain(record.owner) : undefined,
        scheduledTaskId: record.scheduledTaskId,
        scheduledTask: record.scheduledTask
          ? ScheduledTaskMapper.toDomain(record.scheduledTask)
          : undefined,
        notify: record.notify,
        statusPrefix: record.statusPrefix,
        notificationIntegrationId: record.notificationIntegrationId,
        notificationIntegration: record.notificationIntegration
          ? NotificationIntegrationMapper.toDomain(
              record.notificationIntegration,
            )
          : undefined,
      },
    });
    return entity;
  }

  toResponse(
    entity: ScheduledTaskIncidentNotificationEntity,
  ): ScheduledTaskIncidentNotificationResponseDto {
    return ScheduledTaskIncidentNotificationMapper.toResponse(entity);
  }
  static toResponse(
    entity: ScheduledTaskIncidentNotificationEntity,
  ): ScheduledTaskIncidentNotificationResponseDto {
    const props = entity.getProps();
    const notificationProps = props.notificationIntegration.getProps();
    const notificationIntegrationResponse =
      new NotificationIntegrationResponseDto(notificationProps);

    const ownerProps = props.owner.getProps();
    const ownerResponse = new UserResponseDto(ownerProps);
    ownerResponse.name = ownerProps.name;
    ownerResponse.email = ownerProps.email;

    notificationIntegrationResponse.active = notificationProps.active;
    notificationIntegrationResponse.name = notificationProps.name;
    notificationIntegrationResponse.token = notificationProps.token;
    notificationIntegrationResponse.type = notificationProps.type;
    notificationIntegrationResponse.url = notificationProps.url;
    const response = new ScheduledTaskIncidentNotificationResponseDto(entity);
    response.notify = props.notify;
    response.notificationIntegration = notificationIntegrationResponse;
    response.owner = ownerResponse;
    return response;
  }
}
