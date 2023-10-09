import { Body, Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { OperationMapper } from '../../../infrastructure/mappers/operation.mapper';
import { OperationResponseDto } from '../../dtos/operation/operation.response.dto';
import { GetOperationQuery } from '../../queries/operation/get-operation.query';
import { GetOperationRequestDto } from '../../dtos/operation/get-operation.request.dto';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';

@Controller('v1')
export class GetOperationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: OperationMapper,
  ) {}

  @UseGuards(AuthGuard)
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
