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
import { ScheduledTaskRepositoryEntity } from '../scheduled-task/scheduled-task.entity';
import { NotificationIntegrationRepositoryEntity } from '../notification-integration/notification-integration.entity';

export interface ScheduledTaskIncidentNotificationEntityProps {
  ownerId: AggregateID;
  notify: boolean;
  statusPrefix: number;
  scheduledTaskId: AggregateID;
  notificationIntegrationId?: AggregateID;
}

@Entity('scheduled_task_incident_notification')
export class ScheduledTaskIncidentNotificationRepositoryEntity {
  constructor(props: ScheduledTaskIncidentNotificationEntityProps) {
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

  @Column()
  statusPrefix: number;

  @Column()
  notify: boolean;

  @ManyToOne(
    () => UserRepositoryEntity,
    (user: UserRepositoryEntity) => user.id,
  )
  owner: UserRepositoryEntity;

  @Column('uuid')
  ownerId!: string;

  @ManyToOne(
    () => ScheduledTaskRepositoryEntity,
    (task: ScheduledTaskRepositoryEntity) => task.id,
  )
  scheduledTask: ScheduledTaskRepositoryEntity;

  @Column('uuid')
  scheduledTaskId!: string;

  @ManyToOne(
    () => NotificationIntegrationRepositoryEntity,
    (integration: NotificationIntegrationRepositoryEntity) => integration.id,
  )
  notificationIntegration: NotificationIntegrationRepositoryEntity;

  @Column('uuid')
  notificationIntegrationId!: string;
}
