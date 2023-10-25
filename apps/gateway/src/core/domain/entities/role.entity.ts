import { v4 } from 'uuid';
import { AggregateRoot } from 'libs/ddd/aggregate-root.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { DomainEvent, DomainEventProps } from 'libs/ddd/domain-event.base';
import { RolesEnum } from 'libs/common/enum/roles.enum';

export class RoleCreatedDomainEvent extends DomainEvent {
  readonly name: RolesEnum;
  constructor(props: DomainEventProps<RoleCreatedDomainEvent>) {
    super(props);
    this.name = props.name;
  }
}

export class RoleUpdatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<RoleUpdatedDomainEvent>) {
    super(props);
  }
}

// All properties that an Role has
export interface RoleProps {
  name: RolesEnum;
}

// Properties that are needed for a Role creation
export interface CreateRoleProps {
  name: RolesEnum;
}

export interface UpdateRoleProps {
  name: RolesEnum;
}

export class RoleEntity extends AggregateRoot<RoleProps> {
  protected readonly _id: AggregateID;

  static create(props: CreateRoleProps, entityId?: string): RoleEntity {
    const id = entityId || v4();
    const Role = new RoleEntity({ id, props });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    Role.addEvent(
      new RoleCreatedDomainEvent({
        aggregateId: id,
        ...Role.getProps(),
      }),
    );
    return Role;
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */

  get name(): RolesEnum {
    return this.props.name;
  }

  private _setName(name: RolesEnum): void {
    this.props.name = name;
  }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like user.email = otherEmail */

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
