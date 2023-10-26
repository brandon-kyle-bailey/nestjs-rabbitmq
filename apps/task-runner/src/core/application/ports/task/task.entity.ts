import { AggregateID } from 'libs/ddd/entity.base';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export interface TaskEntityProps {
  readonly scheduledTaskId: AggregateID;
  readonly status: number;
  readonly duration: number;
  readonly response: string;
}

@Entity('task')
export class TaskRepositoryEntity {
  constructor(props: TaskEntityProps) {
    Object.assign(this, props);
  }
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  scheduledTaskId: string;
  @CreateDateColumn()
  createdAt?: Date;
  @UpdateDateColumn()
  updatedAt?: Date;
  @DeleteDateColumn()
  deletedAt?: Date;

  @Column()
  status: number;

  @Column()
  duration: number;

  @Column()
  response: string;
}
