import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export interface OperationEntityProps {
  readonly name: string;
  readonly protocol: string;
  readonly host: string;
  readonly port: number;
}

@Entity('operation')
export class OperationRepositoryEntity {
  constructor(props: OperationEntityProps) {
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
  protocol: string;

  @Column()
  host: string;

  @Column()
  port: number;
}
