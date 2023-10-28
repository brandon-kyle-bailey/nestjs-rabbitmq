import { AggregateID } from 'libs/ddd/entity.base';
import { PaginatedParams, PaginatedQueryBase } from 'libs/ddd/query.base';

export class ListNotificationIntegrationQuery extends PaginatedQueryBase {
  readonly userId: AggregateID;
  constructor(props: PaginatedParams<ListNotificationIntegrationQuery>) {
    super(props);
    this.userId = props.userId;
  }

  static create(
    props: ListNotificationIntegrationQuery,
  ): ListNotificationIntegrationQuery {
    return new ListNotificationIntegrationQuery(props);
  }
}
