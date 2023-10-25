import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export interface BillingPlanEntityProps {
  readonly name: string;
  readonly workspaceLimit: number;
  readonly userLimit: number;
  readonly scheduledTaskLimit: number;
  readonly minimumInterval: number;
}

@Entity('billing_plan')
export class BillingPlanRepositoryEntity {
  constructor(props: BillingPlanEntityProps) {
    Object.assign(this, props);
  }
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ length: 500 })
  name: string;

  @Column()
  workspaceLimit: number;

  @Column()
  userLimit: number;

  @Column()
  scheduledTaskLimit: number;

  @Column()
  minimumInterval: number;
}
