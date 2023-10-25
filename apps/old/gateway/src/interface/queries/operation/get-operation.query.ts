import { CommandProps } from 'libs/ddd/command.base';
import { QueryBase } from 'libs/ddd/query.base';

export class GetOperationQuery extends QueryBase {
  readonly id: string;

  private constructor(props: CommandProps<GetOperationQuery>) {
    super();
    this.id = props.id;
  }

  static create(props: GetOperationQuery): GetOperationQuery {
    return new GetOperationQuery(props);
  }
}
