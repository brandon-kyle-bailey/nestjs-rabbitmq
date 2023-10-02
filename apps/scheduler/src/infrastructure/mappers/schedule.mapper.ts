import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import {
  ScheduleEntity,
  ScheduleType,
} from '../../core/domain/entities/schedule.entity';
import { ScheduleResponseDto } from '../../interface/dtos/schedule/schedule.response.dto';
import { ScheduleRepositoryEntity } from '../../core/application/ports/schedule/schedule.entity';

@Injectable()
export class ScheduleMapper
  implements
    Mapper<ScheduleEntity, ScheduleRepositoryEntity, ScheduleResponseDto>
{
  toPersistence(entity: ScheduleEntity): ScheduleRepositoryEntity {
    const copy = entity.getProps();
    const record: ScheduleRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      operationId: copy.operationId,
      type: copy.type,
      interval: Number(copy.interval),
      active: copy.active,
    };
    return record;
  }

  toDomain(record: ScheduleRepositoryEntity): ScheduleEntity {
    const entity = new ScheduleEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: new Date(record.deletedAt),
      props: {
        operationId: record.operationId,
        type: record.type as ScheduleType,
        interval: record.interval,
        active: record.active,
      },
    });
    return entity;
  }

  toResponse(entity: ScheduleEntity): ScheduleResponseDto {
    const props = entity.getProps();
    const response = new ScheduleResponseDto(entity);
    response.operationId = props.operationId;
    response.type = props.type;
    response.interval = props.interval;
    response.active = props.active;
    return response;
  }
}
