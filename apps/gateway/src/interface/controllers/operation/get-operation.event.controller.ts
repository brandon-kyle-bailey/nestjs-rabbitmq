import { Controller, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { OperationMapper } from '../../../infrastructure/mappers/operation.mapper';
import { OperationResponseDto } from '../../dtos/operation/operation.response.dto';
import { OperationIntegrationEvents } from 'libs/events/operation.events';
import { GetOperationQuery } from '../../queries/operation/get-operation.query';
import { GetOperationRequestDto } from '../../dtos/operation/get-operation.request.dto';

@Controller()
export class GetOperationEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: OperationMapper,
  ) {}

  @MessagePattern(OperationIntegrationEvents.Get)
  async get(
    @Payload() payload: GetOperationRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<OperationResponseDto> {
    try {
      const query = GetOperationQuery.create({
        id: payload.id,
      });
      const result = await this.queryBus.execute(query);
      const response = this.mapper.toResponse(result);
      return response;
    } catch (error) {
      this.logger.error(
        'GetOperationEventController.get encountered an error',
        error,
      );
    }
  }
}
