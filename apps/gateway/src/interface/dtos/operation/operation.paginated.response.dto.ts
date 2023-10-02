import { ApiProperty } from '@nestjs/swagger';
import { OperationResponseDto } from './operation.response.dto';
import { PaginatedResponseDto } from 'libs/dto/paginated.response.base';

export class OperationPaginatedResponseDto extends PaginatedResponseDto<OperationResponseDto> {
  @ApiProperty({ type: OperationResponseDto, isArray: true })
  readonly data: readonly OperationResponseDto[];
}
