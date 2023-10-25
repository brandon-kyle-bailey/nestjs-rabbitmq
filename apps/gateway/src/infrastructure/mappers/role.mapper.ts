import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { RoleRepositoryEntity } from '../../core/application/ports/role/role.entity';
import { RoleEntity } from '../../core/domain/entities/role.entity';
import { RolesEnum } from 'libs/common/enum/roles.enum';
import { RoleResponseDto } from '../../interface/dtos/role/role.response.dto';

@Injectable()
export class RoleMapper
  implements Mapper<RoleEntity, RoleRepositoryEntity, RoleResponseDto>
{
  toPersistence(entity: RoleEntity): RoleRepositoryEntity {
    return RoleMapper.toPersistence(entity);
  }
  static toPersistence(entity: RoleEntity): RoleRepositoryEntity {
    const copy = entity.getProps();
    const record: RoleRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      name: copy.name,
    };
    return record;
  }

  toDomain(record: RoleRepositoryEntity): RoleEntity {
    return RoleMapper.toDomain(record);
  }

  static toDomain(record: RoleRepositoryEntity): RoleEntity {
    const entity = new RoleEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        name: record.name as RolesEnum,
      },
    });
    return entity;
  }

  toResponse(entity: RoleEntity): RoleResponseDto {
    return RoleMapper.toResponse(entity);
  }

  static toResponse(entity: RoleEntity): RoleResponseDto {
    const props = entity.getProps();
    const response = new RoleResponseDto();
    response.name = props.name;
    return response;
  }
}
