import { v4 } from 'uuid';
import { AggregateRoot } from 'libs/ddd/aggregate-root.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { DomainEvent, DomainEventProps } from 'libs/ddd/domain-event.base';

export class WorkspaceCreatedDomainEvent extends DomainEvent {
  readonly ownerID: AggregateID;
  readonly name: string;
  constructor(props: DomainEventProps<WorkspaceCreatedDomainEvent>) {
    super(props);
    this.ownerID = props.ownerID;
    this.name = props.name;
  }
}

export class WorkspaceDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<WorkspaceDeletedDomainEvent>) {
    super(props);
  }
}

export class WorkspaceUpdatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<WorkspaceUpdatedDomainEvent>) {
    super(props);
  }
}

// All properties that an Workspace has
export interface WorkspaceProps {
  ownerID: AggregateID;
  name: string;
}

// Properties that are needed for a Workspace creation
export interface CreateWorkspaceProps {
  ownerID: AggregateID;
  name: string;
}

export interface UpdateWorkspaceProps {
  name: string;
}

export class WorkspaceEntity extends AggregateRoot<WorkspaceProps> {
  protected readonly _id: AggregateID;

  static create(
    props: CreateWorkspaceProps,
    entityId?: string,
  ): WorkspaceEntity {
    const id = entityId || v4();
    const workspace = new WorkspaceEntity({ id, props });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    workspace.addEvent(
      new WorkspaceCreatedDomainEvent({
        aggregateId: id,
        ...workspace.getProps(),
      }),
    );
    return workspace;
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */

  get name(): string {
    return this.props.name;
  }

  get ownerID(): AggregateID {
    return this.props.ownerID;
  }

  private _setName(name: string): void {
    this.props.name = name;
  }

  isOwner(userID: string): boolean {
    return userID === this.props.ownerID;
  }

  update(props: UpdateWorkspaceProps): void {
    if (props.name) {
      this._setName(props.name);
    }
    this.addEvent(
      new WorkspaceUpdatedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  delete(): void {
    this.addEvent(
      new WorkspaceDeletedDomainEvent({
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
