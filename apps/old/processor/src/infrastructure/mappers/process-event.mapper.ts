import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { ProcessEventResponseDto } from '../../interface/dtos/process-event/process-event.response.dto';
import { ProcessEventEntity } from '../../core/domain/entities/process-event.entity';
import { ProcessEventRepositoryEntity } from '../../core/application/ports/process-event/process-event.entity';

@Injectable()
export class ProcessEventMapper
  implements
    Mapper<
      ProcessEventEntity,
      ProcessEventRepositoryEntity,
      ProcessEventResponseDto
    >
{
  toPersistence(entity: ProcessEventEntity): ProcessEventRepositoryEntity {
    const copy = entity.getProps();
    const record: ProcessEventRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      operationId: copy.operationId,
      duration: copy.duration,
      status: copy.status,
    };
    return record;
  }

  toDomain(record: ProcessEventRepositoryEntity): ProcessEventEntity {
    const entity = new ProcessEventEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: new Date(record.deletedAt),
      props: {
        operationId: record.operationId,
        duration: record.duration,
        status: record.status,
      },
    });
    return entity;
  }

  toResponse(entity: ProcessEventEntity): ProcessEventResponseDto {
    const props = entity.getProps();
    const response = new ProcessEventResponseDto(entity);
    response.operationId = props.operationId;
    response.status = props.status;
    response.duration = props.duration;
    return response;
  }
}
