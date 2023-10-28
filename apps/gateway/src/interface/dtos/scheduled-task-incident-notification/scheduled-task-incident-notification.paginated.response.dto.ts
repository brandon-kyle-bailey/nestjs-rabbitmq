import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'libs/dto/paginated.response.base';
import { ScheduledTaskIncidentNotificationResponseDto } from './scheduled-task-incident-notification.response.dto';

export class ScheduledTaskIncidentNotificationPaginatedResponseDto extends PaginatedResponseDto<ScheduledTaskIncidentNotificationResponseDto> {
  @ApiProperty({
    type: ScheduledTaskIncidentNotificationResponseDto,
    isArray: true,
  })
  readonly data: readonly ScheduledTaskIncidentNotificationResponseDto[];
}
