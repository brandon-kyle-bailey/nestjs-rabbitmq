import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { ScheduleEntity } from '../../core/domain/entities/schedule.entity';
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
      name: copy.name,
      protocol: copy.protocol,
      host: copy.host,
      port: copy.port,
      interval: copy.interval,
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
        name: record.name,
        protocol: record.protocol,
        host: record.host,
        port: record.port,
        interval: record.interval,
      },
    });
    return entity;
  }

  toResponse(entity: ScheduleEntity): ScheduleResponseDto {
    const props = entity.getProps();
    const response = new ScheduleResponseDto(entity);
    response.name = props.name;
    response.protocol = props.protocol;
    response.host = props.host;
    response.port = props.port;
    response.interval = props.interval;
    return response;
  }
}
