import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'libs/dto/paginated.response.base';
import { NotificationIntegrationResponseDto } from './notification-integration.response.dto';

export class NotificationIntegrationPaginatedResponseDto extends PaginatedResponseDto<NotificationIntegrationResponseDto> {
  @ApiProperty({ type: NotificationIntegrationResponseDto, isArray: true })
  readonly data: readonly NotificationIntegrationResponseDto[];
}
