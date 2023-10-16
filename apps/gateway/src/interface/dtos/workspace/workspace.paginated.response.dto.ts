import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'libs/dto/paginated.response.base';
import { WorkspaceResponseDto } from './workspace.response.dto';

export class WorkspacePaginatedResponseDto extends PaginatedResponseDto<WorkspaceResponseDto> {
  @ApiProperty({ type: WorkspaceResponseDto, isArray: true })
  readonly data: readonly WorkspaceResponseDto[];
}
