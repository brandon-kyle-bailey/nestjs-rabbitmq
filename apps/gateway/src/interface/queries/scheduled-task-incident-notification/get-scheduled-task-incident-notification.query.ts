import { CommandProps } from 'libs/ddd/command.base';
import { QueryBase } from 'libs/ddd/query.base';

export class GetScheduledTaskIncidentNotificationQuery extends QueryBase {
  readonly id: string;

  private constructor(
    props: CommandProps<GetScheduledTaskIncidentNotificationQuery>,
  ) {
    super();
    this.id = props.id;
  }

  static create(
    props: GetScheduledTaskIncidentNotificationQuery,
  ): GetScheduledTaskIncidentNotificationQuery {
    return new GetScheduledTaskIncidentNotificationQuery(props);
  }
}
