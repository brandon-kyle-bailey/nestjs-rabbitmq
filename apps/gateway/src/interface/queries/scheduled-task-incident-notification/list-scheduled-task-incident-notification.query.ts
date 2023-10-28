import { AggregateID } from 'libs/ddd/entity.base';
import { PaginatedParams, PaginatedQueryBase } from 'libs/ddd/query.base';

export class ListScheduledTaskIncidentNotificationQuery extends PaginatedQueryBase {
  readonly userId: AggregateID;
  constructor(
    props: PaginatedParams<ListScheduledTaskIncidentNotificationQuery>,
  ) {
    super(props);
    this.userId = props.userId;
  }

  static create(
    props: ListScheduledTaskIncidentNotificationQuery,
  ): ListScheduledTaskIncidentNotificationQuery {
    return new ListScheduledTaskIncidentNotificationQuery(props);
  }
}
