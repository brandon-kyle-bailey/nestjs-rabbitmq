import { v4 } from 'uuid';
import { AggregateRoot } from 'libs/ddd/aggregate-root.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { DomainEvent, DomainEventProps } from 'libs/ddd/domain-event.base';

export class UserTokenPayloadCreatedDomainEvent extends DomainEvent {
  readonly sub: string;
  readonly username: string;
  readonly email: string;
  constructor(props: DomainEventProps<UserTokenPayloadCreatedDomainEvent>) {
    super(props);
    this.sub = props.sub;
    this.email = props.email;
    this.email = props.email;
  }
}

// All properties that an User has
export interface UserTokenPayloadProps {
  sub: string;
  username: string;
  email: string;
}

// Properties that are needed for a User creation
export interface CreateUserTokenPayloadProps {
  sub: string;
  username: string;
  email: string;
}

export class UserTokenPayloadEntity extends AggregateRoot<UserTokenPayloadProps> {
  protected readonly _id: AggregateID;

  static create(
    props: CreateUserTokenPayloadProps,
    entityId?: string,
  ): UserTokenPayloadEntity {
    const id = entityId || v4();
    const userTokenPayload = new UserTokenPayloadEntity({ id, props });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    userTokenPayload.addEvent(
      new UserTokenPayloadCreatedDomainEvent({
        aggregateId: id,
        ...userTokenPayload.getProps(),
      }),
    );
    return userTokenPayload;
  }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like user.email = otherEmail */

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
