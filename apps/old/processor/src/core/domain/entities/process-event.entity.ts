import { v4 } from 'uuid';
import { AggregateRoot } from 'libs/ddd/aggregate-root.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { DomainEvent, DomainEventProps } from 'libs/ddd/domain-event.base';

export class ProcessEventCreatedDomainEvent extends DomainEvent {
  readonly operationId: AggregateID;
  constructor(props: DomainEventProps<ProcessEventCreatedDomainEvent>) {
    super(props);
    this.operationId = props.operationId;
  }
}

export class ProcessEventDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ProcessEventDeletedDomainEvent>) {
    super(props);
  }
}

// All properties that an Schedule has
export interface ProcessEventProps {
  operationId: AggregateID;
  status: number;
  duration: number;
}

// Properties that are needed for a Schedule creation
export interface CreateProcessEventProps {
  operationId: AggregateID;
  status: number;
  duration: number;
}

export class ProcessEventEntity extends AggregateRoot<ProcessEventProps> {
  protected readonly _id: AggregateID;

  static create(
    props: CreateProcessEventProps,
    entityId?: AggregateID,
  ): ProcessEventEntity {
    const id = entityId || v4();
    const processEvent = new ProcessEventEntity({ props, id });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    processEvent.addEvent(
      new ProcessEventCreatedDomainEvent({
        aggregateId: id,
        ...processEvent.getProps(),
      }),
    );
    return processEvent;
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */

  delete(): void {
    this.addEvent(
      new ProcessEventDeletedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
