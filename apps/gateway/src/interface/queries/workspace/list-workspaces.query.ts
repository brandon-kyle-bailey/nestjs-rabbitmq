import { AggregateID } from 'libs/ddd/entity.base';
import { PaginatedParams, PaginatedQueryBase } from 'libs/ddd/query.base';

export class ListWorkspacesQuery extends PaginatedQueryBase {
  readonly userId: AggregateID;
  constructor(props: PaginatedParams<ListWorkspacesQuery>) {
    super(props);
    this.userId = props.userId;
  }

  static create(props: ListWorkspacesQuery): ListWorkspacesQuery {
    return new ListWorkspacesQuery(props);
  }
}
