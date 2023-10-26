import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { ScheduleRepositoryEntity } from '../../core/application/ports/schedule/schedule.entity';
import { ScheduleEntity } from '../../core/domain/entities/schedule.entity';
import { ScheduleResponseDto } from '../../interface/dtos/schedule.response.dto';

@Injectable()
export class ScheduleMapper
  implements
    Mapper<ScheduleEntity, ScheduleRepositoryEntity, ScheduleResponseDto>
{
  toPersistence(entity: ScheduleEntity): ScheduleRepositoryEntity {
    return ScheduleMapper.toPersistence(entity);
  }

  static toPersistence(entity: ScheduleEntity): ScheduleRepositoryEntity {
    const copy = entity.getProps();
    const record: ScheduleRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      protocol: copy.protocol,
      host: copy.host,
      port: copy.port,
      interval: copy.interval,
      type: copy.type,
      active: copy.active,
      payload: copy.payload,
      scheduledTaskId: copy.scheduledTaskId,
    };
    return record;
  }

  toDomain(record: ScheduleRepositoryEntity): ScheduleEntity {
    return ScheduleMapper.toDomain(record);
  }

  static toDomain(record: ScheduleRepositoryEntity): ScheduleEntity {
    const entity = new ScheduleEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        protocol: record.protocol,
        host: record.host,
        port: record.port,
        interval: record.interval,
        type: record.type,
        active: record.active,
        payload: record.payload,
        scheduledTaskId: record.scheduledTaskId,
      },
    });
    return entity;
  }

  toResponse(entity: ScheduleEntity): ScheduleResponseDto {
    return ScheduleMapper.toResponse(entity);
  }
  static toResponse(entity: ScheduleEntity): ScheduleResponseDto {
    const props = entity.getProps();
    const response = new ScheduleResponseDto();
    response.scheduledTaskId = props.scheduledTaskId;
    response.protocol = props.protocol;
    response.host = props.host;
    response.port = props.port;
    response.interval = props.interval;
    response.type = props.type;
    response.active = props.active;
    response.payload = props.payload;
    return response;
  }
}
