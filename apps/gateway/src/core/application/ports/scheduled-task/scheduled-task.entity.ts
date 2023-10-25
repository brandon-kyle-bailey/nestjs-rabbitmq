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
import { UserRepositoryEntity } from '../user/user.entity';
import { WorkspaceRepositoryEntity } from '../workspace/workspace.entity';

export interface ScheduledTaskEntityProps {
  readonly ownerId: AggregateID;
  readonly workspaceId: AggregateID;
  readonly name: string;
  readonly protocol: string;
  readonly host: string;
  readonly port: number;
  readonly interval: number;
  readonly type: string;
  readonly active: boolean;
  readonly payload: string;
}

@Entity('scheduled_task')
export class ScheduledTaskRepositoryEntity {
  constructor(props: ScheduledTaskEntityProps) {
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

  @Column('uuid')
  ownerId: AggregateID;
  @Column('uuid')
  workspaceId: AggregateID;
  @Column({ length: 500 })
  name: string;
  @Column()
  protocol: string;
  @Column()
  host: string;
  @Column()
  port: number;
  @Column()
  interval: number;
  @Column()
  type: string;
  @Column()
  active: boolean;
  @Column()
  payload: string;

  @ManyToOne(
    () => UserRepositoryEntity,
    (user: UserRepositoryEntity) => user.id,
  )
  owner: UserRepositoryEntity;

  @ManyToOne(
    () => WorkspaceRepositoryEntity,
    (workspace: WorkspaceRepositoryEntity) => workspace.id,
  )
  workspace: WorkspaceRepositoryEntity;
}
