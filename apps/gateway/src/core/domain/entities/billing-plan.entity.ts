import { v4 } from 'uuid';
import { AggregateRoot } from 'libs/ddd/aggregate-root.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { DomainEvent, DomainEventProps } from 'libs/ddd/domain-event.base';

export class BillingPlanCreatedDomainEvent extends DomainEvent {
  readonly name: string;
  constructor(props: DomainEventProps<BillingPlanCreatedDomainEvent>) {
    super(props);
    this.name = props.name;
  }
}

export class BillingPlanUpdatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<BillingPlanUpdatedDomainEvent>) {
    super(props);
  }
}

// All properties that an BillingPlan has
export interface BillingPlanProps {
  name: string;
  workspaceLimit: number;
  userLimit: number;
  scheduledTaskLimit: number;
  minimumInterval: number;
}

// Properties that are needed for a BillingPlan creation
export interface CreateBillingPlanProps {
  name: string;
  workspaceLimit: number;
  userLimit: number;
  scheduledTaskLimit: number;
  minimumInterval: number;
}

export interface UpdateBillingPlanProps {
  name?: string;
  workspaceLimit?: number;
  userLimit?: number;
  scheduledTaskLimit?: number;
  minimumInterval?: number;
}

export class BillingPlanEntity extends AggregateRoot<BillingPlanProps> {
  protected readonly _id: AggregateID;

  static create(
    props: CreateBillingPlanProps,
    entityId?: string,
  ): BillingPlanEntity {
    const id = entityId || v4();
    const BillingPlan = new BillingPlanEntity({ id, props });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    BillingPlan.addEvent(
      new BillingPlanCreatedDomainEvent({
        aggregateId: id,
        ...BillingPlan.getProps(),
      }),
    );
    return BillingPlan;
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

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like user.email = otherEmail */

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
