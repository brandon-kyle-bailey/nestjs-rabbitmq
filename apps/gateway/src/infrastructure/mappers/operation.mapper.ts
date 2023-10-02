import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { OperationRepositoryEntity } from '../../core/application/ports/operation/operation.entity';
import { OperationEntity } from '../../core/domain/entities/operation.entity';
import { OperationResponseDto } from '../../interface/dtos/operation/operation.response.dto';

@Injectable()
export class OperationMapper
  implements
    Mapper<OperationEntity, OperationRepositoryEntity, OperationResponseDto>
{
  toPersistence(entity: OperationEntity): OperationRepositoryEntity {
    const copy = entity.getProps();
    const record: OperationRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      name: copy.name,
      protocol: copy.protocol,
      host: copy.host,
      port: copy.port,
    };
    return record;
  }

  toDomain(record: OperationRepositoryEntity): OperationEntity {
    const entity = new OperationEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        name: record.name,
        protocol: record.protocol,
        host: record.host,
        port: record.port,
        interval: undefined,
      },
    });
    return entity;
  }

  toResponse(entity: OperationEntity): OperationResponseDto {
    const props = entity.getProps();
    const response = new OperationResponseDto(entity);
    response.name = props.name;
    response.protocol = props.protocol;
    response.host = props.host;
    response.port = props.port;
    return response;
  }
}
