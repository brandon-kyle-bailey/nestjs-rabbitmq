import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { BillingPlanRepositoryEntity } from '../../core/application/ports/billing-plan/billing-plan.entity';
import { BillingPlanEntity } from '../../core/domain/entities/billing-plan.entity';
import { BillingPlanResponseDto } from '../../interface/dtos/billing-plan/billing-plan.response.dto';

@Injectable()
export class BillingPlanMapper
  implements
    Mapper<
      BillingPlanEntity,
      BillingPlanRepositoryEntity,
      BillingPlanResponseDto
    >
{
  toPersistence(entity: BillingPlanEntity): BillingPlanRepositoryEntity {
    return BillingPlanMapper.toPersistence(entity);
  }
  static toPersistence(entity: BillingPlanEntity): BillingPlanRepositoryEntity {
    const copy = entity.getProps();
    const record: BillingPlanRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      name: copy.name,
      workspaceLimit: copy.workspaceLimit,
      userLimit: copy.userLimit,
      scheduledTaskLimit: copy.scheduledTaskLimit,
      minimumInterval: copy.minimumInterval,
    };
    return record;
  }

  toDomain(record: BillingPlanRepositoryEntity): BillingPlanEntity {
    return BillingPlanMapper.toDomain(record);
  }

  static toDomain(record: BillingPlanRepositoryEntity): BillingPlanEntity {
    const entity = new BillingPlanEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        name: record.name,
        workspaceLimit: record.workspaceLimit,
        userLimit: record.userLimit,
        scheduledTaskLimit: record.scheduledTaskLimit,
        minimumInterval: record.minimumInterval,
      },
    });
    return entity;
  }

  toResponse(entity: BillingPlanEntity): BillingPlanResponseDto {
    return BillingPlanMapper.toResponse(entity);
  }

  static toResponse(entity: BillingPlanEntity): BillingPlanResponseDto {
    const props = entity.getProps();
    const response = new BillingPlanResponseDto();
    response.name = props.name;
    response.workspaceLimit = props.workspaceLimit;
    response.userLimit = props.userLimit;
    response.scheduledTaskLimit = props.scheduledTaskLimit;
    response.minimumInterval = props.minimumInterval;
    return response;
  }
}
