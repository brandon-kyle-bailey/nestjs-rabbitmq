import { v4 } from 'uuid';
import { AggregateRoot } from 'libs/ddd/aggregate-root.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { DomainEvent, DomainEventProps } from 'libs/ddd/domain-event.base';
import { UserEntity } from './user.entity';
import { WorkspaceEntity } from './workspace.entity';

export class ScheduledTaskCreatedDomainEvent extends DomainEvent {
  readonly name: string;
  readonly owner: UserEntity;
  constructor(props: DomainEventProps<ScheduledTaskCreatedDomainEvent>) {
    super(props);
    this.name = props.name;
    this.owner = props.owner;
  }
}

export class ScheduledTaskDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ScheduledTaskDeletedDomainEvent>) {
    super(props);
  }
}

export class ScheduledTaskUpdatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ScheduledTaskUpdatedDomainEvent>) {
    super(props);
  }
}

// All properties that an ScheduledTask has
export interface ScheduledTaskProps {
  ownerId: AggregateID;
  owner: UserEntity;
  workspaceId: AggregateID;
  workspace: WorkspaceEntity;
  name: string;
  protocol: string;
  host: string;
  port: number;
  interval: number;
  type: string;
  active: boolean;
  payload: string;
}

// Properties that are needed for a ScheduledTask creation
export interface CreateScheduledTaskProps {
  ownerId: AggregateID;
  owner: UserEntity;
  workspaceId: AggregateID;
  workspace: WorkspaceEntity;
  name: string;
  protocol: string;
  host: string;
  port: number;
  interval: number;
  type: string;
  active: boolean;
  payload: string;
}

export interface UpdateScheduledTaskProps {
  name?: string;
  protocol?: string;
  host?: string;
  port?: number;
  interval?: number;
  type?: string;
  active?: boolean;
  payload?: string;
}

export class ScheduledTaskEntity extends AggregateRoot<ScheduledTaskProps> {
  protected readonly _id: AggregateID;

  static create(
    props: CreateScheduledTaskProps,
    entityId?: string,
  ): ScheduledTaskEntity {
    const id = entityId || v4();
    const ScheduledTask = new ScheduledTaskEntity({ id, props });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    ScheduledTask.addEvent(
      new ScheduledTaskCreatedDomainEvent({
        aggregateId: id,
        ...ScheduledTask.getProps(),
      }),
    );
    return ScheduledTask;
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */

  isOwner(userID: string): boolean {
    return userID === this.props.owner.id;
  }

  update(props: UpdateScheduledTaskProps): void {
    this.addEvent(
      new ScheduledTaskUpdatedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  delete(): void {
    this.addEvent(
      new ScheduledTaskDeletedDomainEvent({
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
