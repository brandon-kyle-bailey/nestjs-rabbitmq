import { AggregateID } from 'libs/ddd/entity.base';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { BillingPlanRepositoryEntity } from '../billing-plan/billing-plan.entity';
import { RoleRepositoryEntity } from '../role/role.entity';

export interface UserEntityProps {
  readonly roleId: AggregateID;
  readonly billingCustomerId: AggregateID;
  readonly billingPlanId: AggregateID;
  readonly name: string;
  readonly email: string;
  readonly verified: boolean;
  readonly password: string;
}

@Entity('user')
export class UserRepositoryEntity {
  constructor(props: UserEntityProps) {
    Object.assign(this, props);
  }
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  roleId!: string;

  @Column('uuid')
  billingCustomerId!: string;

  @Column('uuid')
  billingPlanId!: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ length: 500 })
  name: string;

  @Column()
  email: string;

  @Column({ default: false })
  verified: boolean;

  @Column()
  password: string;

  @ManyToOne(
    () => BillingPlanRepositoryEntity,
    (billingPlan: BillingPlanRepositoryEntity) => billingPlan.id,
  )
  billingPlan: BillingPlanRepositoryEntity;

  @ManyToOne(
    () => RoleRepositoryEntity,
    (role: RoleRepositoryEntity) => role.id,
  )
  role: RoleRepositoryEntity;
}
