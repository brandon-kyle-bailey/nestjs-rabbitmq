import { Injectable } from '@nestjs/common';
import { Mapper } from 'libs/ddd/mapper.base';
import { UserRepositoryEntity } from '../../core/application/ports/user/user.entity';
import { UserEntity } from '../../core/domain/entities/user.entity';
import { UserResponseDto } from '../../interface/dtos/user/user.response.dto';
import { RoleMapper } from './role.mapper';
import { BillingPlanMapper } from './billing-plan.mapper';

@Injectable()
export class UserMapper
  implements Mapper<UserEntity, UserRepositoryEntity, UserResponseDto>
{
  toPersistence(entity: UserEntity): UserRepositoryEntity {
    return UserMapper.toPersistence(entity);
  }
  static toPersistence(entity: UserEntity): UserRepositoryEntity {
    const copy = entity.getProps();
    const record: UserRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      name: copy.name,
      email: copy.email,
      verified: copy.verified,
      password: copy.password,
      roleId: copy.role ? copy.role.id : copy.roleId,
      role: copy.role ? RoleMapper.toPersistence(copy.role) : undefined,
      billingCustomerId: copy.billingCustomerId,
      billingPlanId: copy.billingPlan
        ? copy.billingPlan.id
        : copy.billingPlanId,
      billingPlan: copy.billingPlan
        ? BillingPlanMapper.toPersistence(copy.billingPlan)
        : undefined,
    };
    return record;
  }

  toDomain(record: UserRepositoryEntity): UserEntity {
    return UserMapper.toDomain(record);
  }
  static toDomain(record: UserRepositoryEntity): UserEntity {
    const entity = new UserEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        name: record.name,
        email: record.email,
        password: record.password,
        verified: record.verified,
        roleId: record.role ? record.role.id : record.roleId,
        billingPlanId: record.billingPlan
          ? record.billingPlan.id
          : record.billingPlanId,
        role: record.role ? RoleMapper.toDomain(record.role) : undefined,
        billingPlan: record.billingPlan
          ? BillingPlanMapper.toDomain(record.billingPlan)
          : undefined,
        billingCustomerId: record.billingCustomerId,
      },
    });
    return entity;
  }

  toResponse(entity: UserEntity): UserResponseDto {
    return UserMapper.toResponse(entity);
  }

  static toResponse(entity: UserEntity): UserResponseDto {
    const props = entity.getProps();
    const response = new UserResponseDto(entity);
    response.name = props.name;
    response.email = props.email;
    if (props.access_token) response.access_token = props.access_token;
    if (props.refresh_token) response.refresh_token = props.refresh_token;
    return response;
  }
}
