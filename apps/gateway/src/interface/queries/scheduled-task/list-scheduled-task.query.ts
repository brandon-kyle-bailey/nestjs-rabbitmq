import { AggregateID } from 'libs/ddd/entity.base';
import { PaginatedParams, PaginatedQueryBase } from 'libs/ddd/query.base';

export class ListScheduledTaskQuery extends PaginatedQueryBase {
  readonly userId: AggregateID;
  constructor(props: PaginatedParams<ListScheduledTaskQuery>) {
    super(props);
    this.userId = props.userId;
  }

  static create(props: ListScheduledTaskQuery): ListScheduledTaskQuery {
    return new ListScheduledTaskQuery(props);
  }
}
