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

export interface WorkspaceEntityProps {
  readonly ownerID: AggregateID;
  readonly name: string;
}

@Entity('workspace')
export class WorkspaceRepositoryEntity {
  constructor(props: WorkspaceEntityProps) {
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
  name!: string;

  @ManyToOne(
    () => UserRepositoryEntity,
    (user: UserRepositoryEntity) => user.id,
  )
  owner: UserRepositoryEntity;

  @Column('uuid')
  ownerId!: string;
}
