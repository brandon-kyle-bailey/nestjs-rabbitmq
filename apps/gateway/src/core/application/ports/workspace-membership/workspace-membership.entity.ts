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

export interface WorkspaceMembershipEntityProps {
  readonly workspaceId: AggregateID;
  readonly userId: AggregateID;
}

@Entity('workspace_membership')
export class WorkspaceMembershipRepositoryEntity {
  constructor(props: WorkspaceMembershipEntityProps) {
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

  @ManyToOne(
    () => WorkspaceRepositoryEntity,
    (workspace: WorkspaceRepositoryEntity) => workspace.id,
  )
  workspace: WorkspaceRepositoryEntity;

  @Column('uuid')
  workspaceId!: string;

  @ManyToOne(
    () => UserRepositoryEntity,
    (user: UserRepositoryEntity) => user.id,
  )
  user: UserRepositoryEntity;

  @Column('uuid')
  userId!: string;
}
