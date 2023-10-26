import { v4 } from 'uuid';
import { AggregateRoot } from 'libs/ddd/aggregate-root.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { DomainEvent, DomainEventProps } from 'libs/ddd/domain-event.base';

export class TaskCreatedDomainEvent extends DomainEvent {
  readonly scheduledTaskId: AggregateID;
  constructor(props: DomainEventProps<TaskCreatedDomainEvent>) {
    super(props);
    this.scheduledTaskId = props.scheduledTaskId;
  }
}

export class TaskDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<TaskDeletedDomainEvent>) {
    super(props);
  }
}

// All properties that an Task has
export interface TaskProps {
  scheduledTaskId: AggregateID;
  status: number;
  duration: number;
  response: string;
}

// Properties that are needed for a Task creation
export interface CreateTaskProps {
  scheduledTaskId: AggregateID;
  status: number;
  duration: number;
  response: string;
}

export class TaskEntity extends AggregateRoot<TaskProps> {
  protected readonly _id: AggregateID;

  static create(props: CreateTaskProps, entityId?: string): TaskEntity {
    const id = entityId || v4();
    const Task = new TaskEntity({ id, props });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    Task.addEvent(
      new TaskCreatedDomainEvent({
        aggregateId: id,
        ...Task.getProps(),
      }),
    );
    return Task;
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */

  delete(): void {
    this.addEvent(
      new TaskDeletedDomainEvent({
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
