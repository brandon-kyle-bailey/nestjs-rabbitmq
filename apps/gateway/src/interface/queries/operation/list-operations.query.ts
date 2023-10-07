import { PaginatedParams, PaginatedQueryBase } from 'libs/ddd/query.base';

export class ListOperationsQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<ListOperationsQuery>) {
    super(props);
  }

  static create(props: ListOperationsQuery): ListOperationsQuery {
    return new ListOperationsQuery(props);
  }
}
