import { v4 } from 'uuid';
import { AggregateRoot } from 'libs/ddd/aggregate-root.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { DomainEvent, DomainEventProps } from 'libs/ddd/domain-event.base';
import { UserEntity } from './user.entity';
import { NotificationIntegrationEntity } from './notification-integration.entity';
import { ScheduledTaskEntity } from './scheduled-task.entity';

export class ScheduledTaskIncidentNotificationCreatedDomainEvent extends DomainEvent {
  readonly ownerId: AggregateID;
  readonly owner: UserEntity;
  readonly notify: boolean;
  readonly statusPrefix: number;
  readonly scheduledTaskId: AggregateID;
  readonly scheduledTask: ScheduledTaskEntity;
  readonly notificationIntegrationId: AggregateID;
  readonly notificationIntegration: NotificationIntegrationEntity;
  constructor(
    props: DomainEventProps<ScheduledTaskIncidentNotificationCreatedDomainEvent>,
  ) {
    super(props);
    this.ownerId = props.ownerId;
    this.owner = props.owner;
    this.notify = props.notify;
    this.statusPrefix = props.statusPrefix;
    this.scheduledTaskId = props.scheduledTaskId;
    this.scheduledTask = props.scheduledTask;
    this.notificationIntegrationId = props.notificationIntegrationId;
    this.notificationIntegration = props.notificationIntegration;
  }
}

export class ScheduledTaskIncidentNotificationDeletedDomainEvent extends DomainEvent {
  constructor(
    props: DomainEventProps<ScheduledTaskIncidentNotificationDeletedDomainEvent>,
  ) {
    super(props);
  }
}

export class ScheduledTaskIncidentNotificationUpdatedDomainEvent extends DomainEvent {
  constructor(
    props: DomainEventProps<ScheduledTaskIncidentNotificationUpdatedDomainEvent>,
  ) {
    super(props);
  }
}

// All properties that an ScheduledTaskIncidentNotification has
export interface ScheduledTaskIncidentNotificationProps {
  ownerId: AggregateID;
  owner: UserEntity;
  notify: boolean;
  statusPrefix: number;
  scheduledTaskId: AggregateID;
  scheduledTask: ScheduledTaskEntity;
  notificationIntegrationId: AggregateID;
  notificationIntegration: NotificationIntegrationEntity;
}

// Properties that are needed for a ScheduledTaskIncidentNotification creation
export interface CreateScheduledTaskIncidentNotificationProps {
  ownerId: AggregateID;
  owner: UserEntity;
  notify: boolean;
  statusPrefix: number;
  scheduledTaskId: AggregateID;
  scheduledTask: ScheduledTaskEntity;
  notificationIntegrationId: AggregateID;
  notificationIntegration: NotificationIntegrationEntity;
}

export interface UpdateScheduledTaskIncidentNotificationProps {
  notify?: boolean;
  scheduledTaskId?: AggregateID;
  scheduledTask?: ScheduledTaskEntity;
  statusPrefix?: number;
  notificationIntegrationId?: AggregateID;
  notificationIntegration?: NotificationIntegrationEntity;
}

export class ScheduledTaskIncidentNotificationEntity extends AggregateRoot<ScheduledTaskIncidentNotificationProps> {
  protected readonly _id: AggregateID;

  static create(
    props: CreateScheduledTaskIncidentNotificationProps,
    entityId?: string,
  ): ScheduledTaskIncidentNotificationEntity {
    const id = entityId || v4();
    const ScheduledTaskIncidentNotification =
      new ScheduledTaskIncidentNotificationEntity({
        id,
        props,
      });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    ScheduledTaskIncidentNotification.addEvent(
      new ScheduledTaskIncidentNotificationCreatedDomainEvent({
        aggregateId: id,
        ...ScheduledTaskIncidentNotification.getProps(),
      }),
    );
    return ScheduledTaskIncidentNotification;
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */

  isOwner(userID: string): boolean {
    return userID === this.props.owner.id;
  }

  update(props: UpdateScheduledTaskIncidentNotificationProps): void {
    this.addEvent(
      new ScheduledTaskIncidentNotificationUpdatedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  delete(): void {
    this.addEvent(
      new ScheduledTaskIncidentNotificationDeletedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like user.email = otherEmail */

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
