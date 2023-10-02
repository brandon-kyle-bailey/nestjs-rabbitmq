import { Body, Controller, Get, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { OperationMapper } from '../../infrastructure/mappers/operation.mapper';
import { OperationResponseDto } from '../dtos/operation/operation.response.dto';
import { GetOperationQuery } from '../queries/get-operation.query';
import { GetOperationRequestDto } from '../dtos/operation/get-operation.request.dto';

@Controller('v1')
export class GetOperationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: OperationMapper,
  ) {}

  @Get('operation')
  async get(
    @Body() body: GetOperationRequestDto,
  ): Promise<OperationResponseDto> {
    try {
      const query = GetOperationQuery.create({
        id: body.id,
      });
      const result = await this.queryBus.execute(query);
      const response = this.mapper.toResponse(result);
      return response;
    } catch (error) {
      this.logger.error(
        'GetOperationController.get encountered an error',
        error,
      );
    }
  }
}
