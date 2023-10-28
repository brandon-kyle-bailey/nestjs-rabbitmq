import { CommandProps } from 'libs/ddd/command.base';
import { AggregateID } from 'libs/ddd/entity.base';
import { QueryBase } from 'libs/ddd/query.base';

export class FindAllByScheduledTaskIdNotifyStatusPrefixQuery extends QueryBase {
  readonly scheduledTaskId: AggregateID;
  readonly notify: boolean;
  readonly statusPrefix: number;

  private constructor(
    props: CommandProps<FindAllByScheduledTaskIdNotifyStatusPrefixQuery>,
  ) {
    super();
    this.scheduledTaskId = props.scheduledTaskId;
    this.notify = props.notify;
    this.statusPrefix = props.statusPrefix;
  }

  static create(
    props: FindAllByScheduledTaskIdNotifyStatusPrefixQuery,
  ): FindAllByScheduledTaskIdNotifyStatusPrefixQuery {
    return new FindAllByScheduledTaskIdNotifyStatusPrefixQuery(props);
  }
}
