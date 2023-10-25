import { PaginatedParams, PaginatedQueryBase } from 'libs/ddd/query.base';

export class ListWorkspacesQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<ListWorkspacesQuery>) {
    super(props);
  }

  static create(props: ListWorkspacesQuery): ListWorkspacesQuery {
    return new ListWorkspacesQuery(props);
  }
}
