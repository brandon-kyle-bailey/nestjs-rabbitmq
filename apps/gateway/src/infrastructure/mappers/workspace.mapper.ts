import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { WorkspaceRepositoryEntity } from '../../core/application/ports/workspace/workspace.entity';
import { WorkspaceEntity } from '../../core/domain/entities/workspace.entity';
import { WorkspaceResponseDto } from '../../interface/dtos/workspace/workspace.response.dto';

@Injectable()
export class WorkspaceMapper
  implements
    Mapper<WorkspaceEntity, WorkspaceRepositoryEntity, WorkspaceResponseDto>
{
  toPersistence(entity: WorkspaceEntity): WorkspaceRepositoryEntity {
    const copy = entity.getProps();
    const record: WorkspaceRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      name: copy.name,
      ownerID: copy.ownerID,
    };
    return record;
  }

  toDomain(record: WorkspaceRepositoryEntity): WorkspaceEntity {
    const entity = new WorkspaceEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        name: record.name,
        ownerID: record.ownerID,
      },
    });
    return entity;
  }

  toResponse(entity: WorkspaceEntity): WorkspaceResponseDto {
    const props = entity.getProps();
    const response = new WorkspaceResponseDto(entity);
    response.name = props.name;
    return response;
  }
}
