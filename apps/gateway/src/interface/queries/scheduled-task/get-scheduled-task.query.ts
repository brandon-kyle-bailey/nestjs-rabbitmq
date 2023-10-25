import { CommandProps } from 'libs/ddd/command.base';
import { QueryBase } from 'libs/ddd/query.base';

export class GetScheduledTaskQuery extends QueryBase {
  readonly id: string;

  private constructor(props: CommandProps<GetScheduledTaskQuery>) {
    super();
    this.id = props.id;
  }

  static create(props: GetScheduledTaskQuery): GetScheduledTaskQuery {
    return new GetScheduledTaskQuery(props);
  }
}
