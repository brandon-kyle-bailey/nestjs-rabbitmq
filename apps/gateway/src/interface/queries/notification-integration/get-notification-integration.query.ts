import { CommandProps } from 'libs/ddd/command.base';
import { QueryBase } from 'libs/ddd/query.base';

export class GetNotificationIntegrationQuery extends QueryBase {
  readonly id: string;

  private constructor(props: CommandProps<GetNotificationIntegrationQuery>) {
    super();
    this.id = props.id;
  }

  static create(
    props: GetNotificationIntegrationQuery,
  ): GetNotificationIntegrationQuery {
    return new GetNotificationIntegrationQuery(props);
  }
}
