import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { TaskRepositoryEntity } from '../../core/application/ports/task/task.entity';
import { TaskEntity } from '../../core/domain/entities/task.entity';
import { TaskResponseDto } from '../../interface/dtos/task.response.dto';

@Injectable()
export class TaskMapper
  implements Mapper<TaskEntity, TaskRepositoryEntity, TaskResponseDto>
{
  toPersistence(entity: TaskEntity): TaskRepositoryEntity {
    return TaskMapper.toPersistence(entity);
  }

  static toPersistence(entity: TaskEntity): TaskRepositoryEntity {
    const copy = entity.getProps();
    const record: TaskRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      scheduledTaskId: copy.scheduledTaskId,
      status: copy.status,
      duration: copy.duration,
      response: copy.response,
    };
    return record;
  }

  toDomain(record: TaskRepositoryEntity): TaskEntity {
    return TaskMapper.toDomain(record);
  }

  static toDomain(record: TaskRepositoryEntity): TaskEntity {
    const entity = new TaskEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        scheduledTaskId: record.scheduledTaskId,
        status: record.status,
        duration: record.duration,
        response: record.response,
      },
    });
    return entity;
  }

  toResponse(entity: TaskEntity): TaskResponseDto {
    return TaskMapper.toResponse(entity);
  }
  static toResponse(entity: TaskEntity): TaskResponseDto {
    const props = entity.getProps();
    const response = new TaskResponseDto();
    response.scheduledTaskId = props.scheduledTaskId;
    response.status = props.status;
    response.duration = props.duration;
    response.response = props.response;
    return response;
  }
}
