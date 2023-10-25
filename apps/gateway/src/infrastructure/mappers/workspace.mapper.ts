import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { WorkspaceRepositoryEntity } from '../../core/application/ports/workspace/workspace.entity';
import { WorkspaceEntity } from '../../core/domain/entities/workspace.entity';
import { WorkspaceResponseDto } from '../../interface/dtos/workspace/workspace.response.dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class WorkspaceMapper
  implements
    Mapper<WorkspaceEntity, WorkspaceRepositoryEntity, WorkspaceResponseDto>
{
  toPersistence(entity: WorkspaceEntity): WorkspaceRepositoryEntity {
    return WorkspaceMapper.toPersistence(entity);
  }

  static toPersistence(entity: WorkspaceEntity): WorkspaceRepositoryEntity {
    const copy = entity.getProps();
    const record: WorkspaceRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      name: copy.name,
      owner: copy.owner ? UserMapper.toPersistence(copy.owner) : undefined,
      ownerId: copy.owner.id,
    };
    return record;
  }

  toDomain(record: WorkspaceRepositoryEntity): WorkspaceEntity {
    return WorkspaceMapper.toDomain(record);
  }

  static toDomain(record: WorkspaceRepositoryEntity): WorkspaceEntity {
    const entity = new WorkspaceEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        name: record.name,
        owner: record.owner ? UserMapper.toDomain(record.owner) : undefined,
      },
    });
    return entity;
  }

  toResponse(entity: WorkspaceEntity): WorkspaceResponseDto {
    return WorkspaceMapper.toResponse(entity);
  }
  static toResponse(entity: WorkspaceEntity): WorkspaceResponseDto {
    const props = entity.getProps();
    const response = new WorkspaceResponseDto(entity);
    response.name = props.name;
    return response;
  }
}
