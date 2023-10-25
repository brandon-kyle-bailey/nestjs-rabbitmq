import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { UserMapper } from './user.mapper';
import { ScheduledTaskRepositoryEntity } from '../../core/application/ports/scheduled-task/scheduled-task.entity';
import { ScheduledTaskEntity } from '../../core/domain/entities/scheduled-task.entity';
import { ScheduledTaskResponseDto } from '../../interface/dtos/scheduled-task/scheduled-task.response.dto';
import { WorkspaceMapper } from './workspace.mapper';

@Injectable()
export class ScheduledTaskMapper
  implements
    Mapper<
      ScheduledTaskEntity,
      ScheduledTaskRepositoryEntity,
      ScheduledTaskResponseDto
    >
{
  toPersistence(entity: ScheduledTaskEntity): ScheduledTaskRepositoryEntity {
    return ScheduledTaskMapper.toPersistence(entity);
  }

  static toPersistence(
    entity: ScheduledTaskEntity,
  ): ScheduledTaskRepositoryEntity {
    const copy = entity.getProps();
    const record: ScheduledTaskRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      name: copy.name,
      protocol: copy.protocol,
      host: copy.host,
      port: copy.port,
      interval: copy.interval,
      type: copy.type,
      active: copy.active,
      payload: copy.payload,
      owner: copy.owner ? UserMapper.toPersistence(copy.owner) : undefined,
      ownerId: copy.owner ? copy.owner.id : undefined,
      workspace: copy.workspace
        ? WorkspaceMapper.toPersistence(copy.workspace)
        : undefined,
      workspaceId: copy.workspace ? copy.workspace.id : undefined,
    };
    return record;
  }

  toDomain(record: ScheduledTaskRepositoryEntity): ScheduledTaskEntity {
    return ScheduledTaskMapper.toDomain(record);
  }

  static toDomain(record: ScheduledTaskRepositoryEntity): ScheduledTaskEntity {
    const entity = new ScheduledTaskEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        name: record.name,
        protocol: record.protocol,
        host: record.host,
        port: record.port,
        interval: record.interval,
        type: record.type,
        active: record.active,
        payload: record.payload,
        owner: record.owner ? UserMapper.toDomain(record.owner) : undefined,
        ownerId: record.owner ? record.owner.id : undefined,
        workspace: record.workspace
          ? WorkspaceMapper.toDomain(record.workspace)
          : undefined,
        workspaceId: record.workspace ? record.workspace.id : undefined,
      },
    });
    return entity;
  }

  toResponse(entity: ScheduledTaskEntity): ScheduledTaskResponseDto {
    return ScheduledTaskMapper.toResponse(entity);
  }
  static toResponse(entity: ScheduledTaskEntity): ScheduledTaskResponseDto {
    const props = entity.getProps();
    const response = new ScheduledTaskResponseDto(entity);
    response.name = props.name;
    response.protocol = props.protocol;
    response.host = props.host;
    response.port = props.port;
    response.interval = props.interval;
    response.type = props.type;
    response.active = props.active;
    response.payload = props.payload;
    return response;
  }
}
