import { AggregateID } from 'libs/ddd/entity.base';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export interface ProcessEventEntityProps {
  readonly operationId: AggregateID;
}

@Entity('processevent')
export class ProcessEventRepositoryEntity {
  constructor(props: ProcessEventEntityProps) {
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
  status: number;

  @Column()
  duration: number;
}
