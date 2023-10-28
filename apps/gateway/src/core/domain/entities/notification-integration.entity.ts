import { v4 } from 'uuid';
import { AggregateRoot } from 'libs/ddd/aggregate-root.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { DomainEvent, DomainEventProps } from 'libs/ddd/domain-event.base';
import { UserEntity } from './user.entity';

export class NotificationIntegrationCreatedDomainEvent extends DomainEvent {
  readonly name: string;
  readonly owner: UserEntity;
  readonly type: string;
  readonly url: string;
  readonly token: string;
  readonly active: boolean;
  constructor(
    props: DomainEventProps<NotificationIntegrationCreatedDomainEvent>,
  ) {
    super(props);
    this.name = props.name;
    this.owner = props.owner;
    this.type = props.type;
    this.url = props.url;
    this.token = props.token;
    this.active = props.active;
  }
}

export class NotificationIntegrationDeletedDomainEvent extends DomainEvent {
  constructor(
    props: DomainEventProps<NotificationIntegrationDeletedDomainEvent>,
  ) {
    super(props);
  }
}

export class NotificationIntegrationUpdatedDomainEvent extends DomainEvent {
  constructor(
    props: DomainEventProps<NotificationIntegrationUpdatedDomainEvent>,
  ) {
    super(props);
  }
}

// All properties that an NotificationIntegration has
export interface NotificationIntegrationProps {
  name: string;
  owner: UserEntity;
  type: string;
  url: string;
  token: string;
  active: boolean;
}

// Properties that are needed for a NotificationIntegration creation
export interface CreateNotificationIntegrationProps {
  name: string;
  owner: UserEntity;
  type: string;
  url: string;
  token: string;
  active: boolean;
}

export interface UpdateNotificationIntegrationProps {
  name: string;
  active: boolean;
  url: string;
  token: string;
}

export class NotificationIntegrationEntity extends AggregateRoot<NotificationIntegrationProps> {
  protected readonly _id: AggregateID;

  static create(
    props: CreateNotificationIntegrationProps,
    entityId?: string,
  ): NotificationIntegrationEntity {
    const id = entityId || v4();
    const NotificationIntegration = new NotificationIntegrationEntity({
      id,
      props,
    });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    NotificationIntegration.addEvent(
      new NotificationIntegrationCreatedDomainEvent({
        aggregateId: id,
        ...NotificationIntegration.getProps(),
      }),
    );
    return NotificationIntegration;
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */

  get name(): string {
    return this.props.name;
  }

  private _setName(name: string): void {
    this.props.name = name;
  }

  isOwner(userID: string): boolean {
    return userID === this.props.owner.id;
  }

  update(props: UpdateNotificationIntegrationProps): void {
    if (props.name) {
      this._setName(props.name);
    }
    this.addEvent(
      new NotificationIntegrationUpdatedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  delete(): void {
    this.addEvent(
      new NotificationIntegrationDeletedDomainEvent({
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
