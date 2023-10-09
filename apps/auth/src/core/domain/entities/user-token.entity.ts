import { v4 } from 'uuid';
import { AggregateRoot } from 'libs/ddd/aggregate-root.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { DomainEvent, DomainEventProps } from 'libs/ddd/domain-event.base';

export class UserTokenCreatedDomainEvent extends DomainEvent {
  readonly access_token: string;
  constructor(props: DomainEventProps<UserTokenCreatedDomainEvent>) {
    super(props);
    this.access_token = props.access_token;
  }
}

// All properties that an User has
export interface UserTokenProps {
  access_token: string;
}

// Properties that are needed for a User creation
export interface CreateUserTokenProps {
  access_token: string;
}

export class UserTokenEntity extends AggregateRoot<UserTokenProps> {
  protected readonly _id: AggregateID;

  static create(
    props: CreateUserTokenProps,
    entityId?: string,
  ): UserTokenEntity {
    const id = entityId || v4();
    const userToken = new UserTokenEntity({ id, props });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    userToken.addEvent(
      new UserTokenCreatedDomainEvent({
        aggregateId: id,
        ...userToken.getProps(),
      }),
    );
    return userToken;
  }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like user.email = otherEmail */

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
