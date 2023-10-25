import { CommandProps } from 'libs/ddd/command.base';
import { QueryBase } from 'libs/ddd/query.base';

export class GetWorkspaceQuery extends QueryBase {
  readonly id: string;

  private constructor(props: CommandProps<GetWorkspaceQuery>) {
    super();
    this.id = props.id;
  }

  static create(props: GetWorkspaceQuery): GetWorkspaceQuery {
    return new GetWorkspaceQuery(props);
  }
}
