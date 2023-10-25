import { PaginatedParams, PaginatedQueryBase } from 'libs/ddd/query.base';

export class ListScheduledTaskQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<ListScheduledTaskQuery>) {
    super(props);
  }

  static create(props: ListScheduledTaskQuery): ListScheduledTaskQuery {
    return new ListScheduledTaskQuery(props);
  }
}
