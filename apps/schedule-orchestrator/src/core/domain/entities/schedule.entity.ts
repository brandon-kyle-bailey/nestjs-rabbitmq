import { v4 } from 'uuid';
import { AggregateRoot } from 'libs/ddd/aggregate-root.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { DomainEvent, DomainEventProps } from 'libs/ddd/domain-event.base';

export enum ScheduleType {
  Cron = 'cron',
  Timeout = 'timeout',
  Interval = 'interval',
}

export class ScheduleCreatedDomainEvent extends DomainEvent {
  readonly scheduledTaskId: AggregateID;
  readonly protocol: string;
  readonly host: string;
  readonly port: number;
  readonly interval: number;
  readonly type: string;
  readonly active: boolean;
  readonly payload: string;
  constructor(props: DomainEventProps<ScheduleCreatedDomainEvent>) {
    super(props);
    this.scheduledTaskId = props.scheduledTaskId;
    this.protocol = props.protocol;
    this.host = props.host;
    this.port = props.port;
    this.interval = props.interval;
    this.type = props.type;
    this.active = props.active;
    this.payload = props.payload;
  }
}

export class ScheduleLoadDomainEvent extends DomainEvent {
  readonly scheduledTaskId: AggregateID;
  readonly protocol: string;
  readonly host: string;
  readonly port: number;
  readonly interval: number;
  readonly type: string;
  readonly payload: string;
  constructor(props: DomainEventProps<ScheduleCreatedDomainEvent>) {
    super(props);
    this.scheduledTaskId = props.scheduledTaskId;
    this.protocol = props.protocol;
    this.host = props.host;
    this.port = props.port;
    this.interval = props.interval;
    this.type = props.type;
    this.payload = props.payload;
  }
}

export class ScheduleDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ScheduleDeletedDomainEvent>) {
    super(props);
  }
}

export class ScheduleUnloadDomainEvent extends DomainEvent {
  readonly type: string;
  readonly scheduledTaskId: AggregateID;
  constructor(props: DomainEventProps<ScheduleUnloadDomainEvent>) {
    super(props);
    this.type = props.type;
    this.scheduledTaskId = props.scheduledTaskId;
  }
}

export class ScheduleUpdatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ScheduleUpdatedDomainEvent>) {
    super(props);
  }
}

// All properties that an Schedule has
export interface ScheduleProps {
  scheduledTaskId: AggregateID;
  protocol: string;
  host: string;
  port: number;
  interval: number;
  type: string;
  active: boolean;
  payload: string;
}

// Properties that are needed for a Schedule creation
export interface CreateScheduleProps {
  scheduledTaskId: AggregateID;
  protocol: string;
  host: string;
  port: number;
  interval: number;
  type: string;
  active: boolean;
  payload: string;
}

export interface UpdateScheduleProps {
  protocol?: string;
  host?: string;
  port?: number;
  interval?: number;
  type?: string;
  active?: boolean;
  payload?: string;
}

export class ScheduleEntity extends AggregateRoot<ScheduleProps> {
  protected readonly _id: AggregateID;

  static create(props: CreateScheduleProps, entityId?: string): ScheduleEntity {
    const id = entityId || v4();
    const schedule = new ScheduleEntity({ id, props });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    schedule.addEvent(
      new ScheduleCreatedDomainEvent({
        aggregateId: id,
        ...schedule.getProps(),
      }),
    );
    return schedule;
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */

  load(): void {
    const { scheduledTaskId, protocol, host, port, interval, type, payload } =
      this.getProps();
    this.addEvent(
      new ScheduleLoadDomainEvent({
        aggregateId: this.id,
        scheduledTaskId,
        protocol,
        host,
        port,
        interval,
        type,
        payload,
        active: true,
      }),
    );
  }

  unload(): void {
    const { scheduledTaskId, type } = this.getProps();
    this.addEvent(
      new ScheduleUnloadDomainEvent({
        aggregateId: this.id,
        scheduledTaskId,
        type,
      }),
    );
  }

  delete(): void {
    this.addEvent(
      new ScheduleDeletedDomainEvent({
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
