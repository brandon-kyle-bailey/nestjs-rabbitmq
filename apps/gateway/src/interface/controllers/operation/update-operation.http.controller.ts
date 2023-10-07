import { Body, Controller, Logger, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OperationResponseDto } from '../../dtos/operation/operation.response.dto';
import { OperationMapper } from '../../../infrastructure/mappers/operation.mapper';
import { UpdateOperationRequestDto } from '../../dtos/operation/update-operation.request.dto';
import { UpdateOperationCommand } from '../../commands/operation/update-operation.command';

@Controller('v1')
export class UpdateOperationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly operationMapper: OperationMapper,
  ) {}

  @Put('operation')
  async update(
    @Body() body: UpdateOperationRequestDto,
  ): Promise<OperationResponseDto> {
    try {
      const command = UpdateOperationCommand.create(body);
      const result = await this.commandBus.execute(command);
      return this.operationMapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'UpdateOperationController.update encountered an error',
        error,
      );
    }
  }
}
