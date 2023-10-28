import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { UserMapper } from './user.mapper';
import { NotificationIntegrationRepositoryEntity } from '../../core/application/ports/notification-integration/notification-integration.entity';
import { NotificationIntegrationEntity } from '../../core/domain/entities/notification-integration.entity';
import { NotificationIntegrationResponseDto } from '../../interface/dtos/notification-integration/notification-integration.response.dto';
import { UserResponseDto } from '../../interface/dtos/user/user.response.dto';

@Injectable()
export class NotificationIntegrationMapper
  implements
    Mapper<
      NotificationIntegrationEntity,
      NotificationIntegrationRepositoryEntity,
      NotificationIntegrationResponseDto
    >
{
  toPersistence(
    entity: NotificationIntegrationEntity,
  ): NotificationIntegrationRepositoryEntity {
    return NotificationIntegrationMapper.toPersistence(entity);
  }

  static toPersistence(
    entity: NotificationIntegrationEntity,
  ): NotificationIntegrationRepositoryEntity {
    const copy = entity.getProps();
    const record: NotificationIntegrationRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      name: copy.name,
      owner: copy.owner ? UserMapper.toPersistence(copy.owner) : undefined,
      ownerId: copy.owner.id,
      type: copy.type,
      url: copy.url,
      token: copy.token,
      active: copy.active,
    };
    return record;
  }

  toDomain(
    record: NotificationIntegrationRepositoryEntity,
  ): NotificationIntegrationEntity {
    return NotificationIntegrationMapper.toDomain(record);
  }

  static toDomain(
    record: NotificationIntegrationRepositoryEntity,
  ): NotificationIntegrationEntity {
    const entity = new NotificationIntegrationEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        name: record.name,
        owner: record.owner ? UserMapper.toDomain(record.owner) : undefined,
        type: record.type,
        url: record.url,
        token: record.token,
        active: record.active,
      },
    });
    return entity;
  }

  toResponse(
    entity: NotificationIntegrationEntity,
  ): NotificationIntegrationResponseDto {
    return NotificationIntegrationMapper.toResponse(entity);
  }
  static toResponse(
    entity: NotificationIntegrationEntity,
  ): NotificationIntegrationResponseDto {
    const props = entity.getProps();
    const userProps = props.owner.getProps();
    const ownerResponse = new UserResponseDto(props.owner);
    ownerResponse.email = userProps.email;
    ownerResponse.name = userProps.name;
    const response = new NotificationIntegrationResponseDto(entity);
    response.name = props.name;
    response.type = props.type;
    response.url = props.url;
    response.token = props.token;
    response.active = props.active;
    response.owner = ownerResponse;
    return response;
  }
}
