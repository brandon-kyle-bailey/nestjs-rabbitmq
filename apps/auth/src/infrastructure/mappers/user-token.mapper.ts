import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { UserTokenResponseDto } from '../../interface/dtos/user-token.response.dto';
import { UserTokenEntity } from '../../core/domain/entities/user-token.entity';

export interface UserTokenEntityProps {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly access_token: string;
}

@Injectable()
export class UserTokenMapper
  implements
    Omit<
      Mapper<UserTokenEntity, UserTokenEntityProps, UserTokenResponseDto>,
      'toPersistence'
    >
{
  toDomain(record: UserTokenEntityProps): UserTokenEntity {
    return new UserTokenEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        access_token: record.access_token,
      },
    });
  }
  toResponse(entity: UserTokenEntity): UserTokenResponseDto {
    const props = entity.getProps();
    const response = new UserTokenResponseDto(entity);
    response.access_token = props.access_token;
    return response;
  }
}
