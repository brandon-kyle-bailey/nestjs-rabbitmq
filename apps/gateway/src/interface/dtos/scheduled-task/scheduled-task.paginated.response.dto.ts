import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'libs/dto/paginated.response.base';
import { ScheduledTaskResponseDto } from './scheduled-task.response.dto';

export class ScheduledTaskPaginatedResponseDto extends PaginatedResponseDto<ScheduledTaskResponseDto> {
  @ApiProperty({ type: ScheduledTaskResponseDto, isArray: true })
  readonly data: readonly ScheduledTaskResponseDto[];
}
