import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { UserRepositoryEntity } from '../../core/application/ports/user/user.entity';
import { UserEntity } from '../../core/domain/entities/user.entity';
import { UserResponseDto } from '../../interface/dtos/user/user.response.dto';

@Injectable()
export class UserMapper
  implements Mapper<UserEntity, UserRepositoryEntity, UserResponseDto>
{
  toPersistence(entity: UserEntity): UserRepositoryEntity {
    const copy = entity.getProps();
    const record: UserRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      name: copy.name,
      email: copy.email,
      password: copy.password,
    };
    return record;
  }

  toDomain(record: UserRepositoryEntity): UserEntity {
    const entity = new UserEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        name: record.name,
        email: record.email,
        password: record.password,
      },
    });
    return entity;
  }

  toResponse(entity: UserEntity): UserResponseDto {
    const props = entity.getProps();
    const response = new UserResponseDto(entity);
    response.name = props.name;
    response.email = props.email;
    if (props.access_token) response.access_token = props.access_token;
    return response;
  }
}
