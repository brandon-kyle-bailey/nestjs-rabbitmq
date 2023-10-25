import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { UserMapper } from './user.mapper';
import { WorkspaceMembershipRepositoryEntity } from '../../core/application/ports/workspace-membership/workspace-membership.entity';
import { WorkspaceMembershipEntity } from '../../core/domain/entities/workspace-membership.entity';
import { WorkspaceMapper } from './workspace.mapper';
import { WorkspaceMembershipResponseDto } from '../../interface/dtos/workspace-membership/workspace-membership.response.dto';

@Injectable()
export class WorkspaceMembershipMapper
  implements
    Mapper<
      WorkspaceMembershipEntity,
      WorkspaceMembershipRepositoryEntity,
      WorkspaceMembershipResponseDto
    >
{
  toPersistence(
    entity: WorkspaceMembershipEntity,
  ): WorkspaceMembershipRepositoryEntity {
    return WorkspaceMembershipMapper.toPersistence(entity);
  }

  static toPersistence(
    entity: WorkspaceMembershipEntity,
  ): WorkspaceMembershipRepositoryEntity {
    const copy = entity.getProps();
    const record: WorkspaceMembershipRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      userId: copy.userId,
      workspaceId: copy.workspaceId,
      user: UserMapper.toPersistence(copy.user),
      workspace: WorkspaceMapper.toPersistence(copy.workspace),
    };
    return record;
  }

  toDomain(
    record: WorkspaceMembershipRepositoryEntity,
  ): WorkspaceMembershipEntity {
    return WorkspaceMembershipMapper.toDomain(record);
  }

  static toDomain(
    record: WorkspaceMembershipRepositoryEntity,
  ): WorkspaceMembershipEntity {
    const entity = new WorkspaceMembershipEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        userId: record.userId,
        workspaceId: record.workspaceId,
        user: record.user ? UserMapper.toDomain(record.user) : undefined,
        workspace: record.workspace
          ? WorkspaceMapper.toDomain(record.workspace)
          : undefined,
      },
    });
    return entity;
  }

  toResponse(
    entity: WorkspaceMembershipEntity,
  ): WorkspaceMembershipResponseDto {
    return WorkspaceMembershipMapper.toResponse(entity);
  }
  static toResponse(
    entity: WorkspaceMembershipEntity,
  ): WorkspaceMembershipResponseDto {
    const props = entity.getProps();
    const response = new WorkspaceMembershipResponseDto(entity);
    response.userId = props.userId;
    response.workspaceId = props.workspaceId;
    return response;
  }
}
