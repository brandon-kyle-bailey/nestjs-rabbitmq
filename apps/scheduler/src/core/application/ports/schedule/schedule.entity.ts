import { AggregateID } from 'libs/ddd/entity.base';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';
import { ScheduleType } from '../../../domain/entities/schedule.entity';

export interface ScheduleEntityProps {
  readonly operationId: AggregateID;
  readonly type: ScheduleType;
  readonly active: boolean;
}

@Entity('schedule')
export class ScheduleRepositoryEntity {
  constructor(props: ScheduleEntityProps) {
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
  operationId: string;

  @Column()
  type: string;

  @Column()
  active: boolean;

  @Column()
  interval: number;
}
