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

export interface ScheduleEntityProps {
  readonly scheduledTaskId: AggregateID;
  readonly protocol: string;
  readonly host: string;
  readonly port: number;
  readonly interval: number;
  readonly type: string;
  readonly active: boolean;
  readonly payload: string;
}

@Entity('schedule')
export class ScheduleRepositoryEntity {
  constructor(props: ScheduleEntityProps) {
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
}
