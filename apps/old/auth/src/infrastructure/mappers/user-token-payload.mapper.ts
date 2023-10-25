import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { UserTokenPayloadResponseDto } from '../../interface/dtos/user-token-payload.response.dto';
import { UserTokenPayloadEntity } from '../../core/domain/entities/user-token-payload.entity';

export interface UserTokenPayloadEntityProps {
  readonly id: string;
  readonly sub: string;
  readonly username: string;
  readonly email: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

@Injectable()
export class UserTokenPayloadMapper
  implements
    Omit<
      Mapper<
        UserTokenPayloadEntity,
        UserTokenPayloadEntityProps,
        UserTokenPayloadResponseDto
      >,
      'toPersistence'
    >
{
  toDomain(record: UserTokenPayloadEntityProps): UserTokenPayloadEntity {
    return new UserTokenPayloadEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        sub: record.sub,
        username: record.username,
        email: record.email,
      },
    });
  }
  toResponse(entity: UserTokenPayloadEntity): UserTokenPayloadResponseDto {
    const props = entity.getProps();
    const response = new UserTokenPayloadResponseDto(entity);
    response.sub = props.sub;
    response.username = props.username;
    response.email = props.email;
    return response;
  }
}
