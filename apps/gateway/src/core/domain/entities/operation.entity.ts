import { v4 } from 'uuid';
import { AggregateRoot } from 'libs/ddd/aggregate-root.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { DomainEvent, DomainEventProps } from 'libs/ddd/domain-event.base';

export class OperationCreatedDomainEvent extends DomainEvent {
  readonly name: string;
  readonly protocol: string;
  readonly host: string;
  readonly port: number;
  readonly interval: number;
  constructor(props: DomainEventProps<OperationCreatedDomainEvent>) {
    super(props);
    this.name = props.name;
    this.protocol = props.protocol;
    this.host = props.host;
    this.port = props.port;
    this.interval = props.interval;
  }
}

export class OperationDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<OperationDeletedDomainEvent>) {
    super(props);
  }
}

// All properties that an Operation has
export interface OperationProps {
  name: string;
  protocol: string;
  host: string;
  port: number;
  interval: number;
}

// Properties that are needed for a operation creation
export interface CreateOperationProps {
  name: string;
  protocol: string;
  host: string;
  port: number;
  interval: number;
}

export class OperationEntity extends AggregateRoot<OperationProps> {
  protected readonly _id: AggregateID;

  static create(props: CreateOperationProps): OperationEntity {
    const id = v4();
    const operation = new OperationEntity({ id, props });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    operation.addEvent(
      new OperationCreatedDomainEvent({
        aggregateId: id,
        ...operation.getProps(),
      }),
    );
    return operation;
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */

  delete(): void {
    this.addEvent(
      new OperationDeletedDomainEvent({
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
