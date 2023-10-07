import { v4 } from 'uuid';
import { AggregateRoot } from 'libs/ddd/aggregate-root.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { DomainEvent, DomainEventProps } from 'libs/ddd/domain-event.base';

export class UserCreatedDomainEvent extends DomainEvent {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props);
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
  }
}

export class UserDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<UserDeletedDomainEvent>) {
    super(props);
  }
}

export class UserUpdatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<UserUpdatedDomainEvent>) {
    super(props);
  }
}

// All properties that an User has
export interface UserProps {
  name: string;
  email: string;
  password: string;
}

// Properties that are needed for a User creation
export interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserProps extends Partial<CreateUserProps> {}

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id: AggregateID;

  static create(props: CreateUserProps, entityId?: string): UserEntity {
    const id = entityId || v4();
    const User = new UserEntity({ id, props });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    User.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: id,
        ...User.getProps(),
      }),
    );
    return User;
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */

  delete(): void {
    this.addEvent(
      new UserDeletedDomainEvent({
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
