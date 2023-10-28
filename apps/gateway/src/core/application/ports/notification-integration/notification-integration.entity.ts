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

export interface NotificationIntegrationEntityProps {
  readonly ownerId: AggregateID;
  readonly name: string;
  readonly type: string;
  readonly url: string;
  readonly token: string;
  readonly active: boolean;
}

@Entity('notification_integration')
export class NotificationIntegrationRepositoryEntity {
  constructor(props: NotificationIntegrationEntityProps) {
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

  @Column()
  type: string;

  @Column()
  url: string;

  @Column()
  token: string;

  @Column()
  active: boolean;

  @ManyToOne(
    () => UserRepositoryEntity,
    (user: UserRepositoryEntity) => user.id,
  )
  owner: UserRepositoryEntity;

  @Column('uuid')
  ownerId!: string;
}
