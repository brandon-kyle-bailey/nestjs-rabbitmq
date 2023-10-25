import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { AggregateRoot } from 'libs/ddd/aggregate-root.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { DomainEvent, DomainEventProps } from 'libs/ddd/domain-event.base';

export class UserCreatedDomainEvent extends DomainEvent {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly access_token?: string;
  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props);
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.access_token = props.access_token;
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
  access_token?: string;
}

// Properties that are needed for a User creation
export interface CreateUserProps extends UserProps {}

export interface UpdateUserProps extends Partial<CreateUserProps> {}

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id: AggregateID;

  static create(props: CreateUserProps, entityId?: string): UserEntity {
    const id = entityId || v4();
    const password = bcrypt.hashSync(props.password, 10);
    const user = new UserEntity({ id, props: { ...props, password } });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: id,
        ...user.getProps(),
      }),
    );
    return user;
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

  verifyPasswordHash(password: string): boolean {
    return bcrypt.compareSync(password, this.props.password);
  }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like user.email = otherEmail */

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
