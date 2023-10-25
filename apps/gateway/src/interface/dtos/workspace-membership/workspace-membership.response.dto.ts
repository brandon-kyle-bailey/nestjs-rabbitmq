import { ResponseBase } from 'libs/dto/response.base';

export class WorkspaceMembershipResponseDto extends ResponseBase {
  userId: string;
  workspaceId: string;
}
