import { v4 } from 'uuid';
import { AggregateRoot } from 'libs/ddd/aggregate-root.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { DomainEvent, DomainEventProps } from 'libs/ddd/domain-event.base';

export class ScheduleCreatedDomainEvent extends DomainEvent {
  readonly operationId: AggregateID;
  readonly type: ScheduleType;
  readonly interval: number;
  readonly active: boolean;
  constructor(props: DomainEventProps<ScheduleCreatedDomainEvent>) {
    super(props);
    this.operationId = props.operationId;
    this.interval = props.interval;
    this.type = props.type;
    this.active = props.active;
  }
}

export class ScheduleDeletedDomainEvent extends DomainEvent {
  readonly operationId: AggregateID;
  readonly type: ScheduleType;
  constructor(props: DomainEventProps<ScheduleDeletedDomainEvent>) {
    super(props);
    this.operationId = props.operationId;
    this.type = props.type;
  }
}

export enum ScheduleType {
  Cron = 'cron',
  Timeout = 'timeout',
  Interval = 'interval',
}

// All properties that an Schedule has
export interface ScheduleProps {
  operationId: AggregateID;
  type: ScheduleType;
  interval: number;
  active: boolean;
}

// Properties that are needed for a Schedule creation
export interface CreateScheduleProps {
  operationId: AggregateID;
  interval: number;
  type: ScheduleType;
  active: boolean;
}

export class ScheduleEntity extends AggregateRoot<ScheduleProps> {
  protected readonly _id: AggregateID;

  static create(
    props: CreateScheduleProps,
    entityId?: AggregateID,
  ): ScheduleEntity {
    const id = entityId || v4();
    const schedule = new ScheduleEntity({ props, id });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    schedule.create();
    return schedule;
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */

  create(): void {
    this.addEvent(
      new ScheduleCreatedDomainEvent({
        aggregateId: this.id,
        ...this.getProps(),
      }),
    );
  }

  delete(): void {
    this.addEvent(
      new ScheduleDeletedDomainEvent({
        aggregateId: this.id,
        operationId: this.getProps().operationId,
        type: this.getProps().type,
      }),
    );
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
