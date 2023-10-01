import { Body, Controller, Delete, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOperationRequestDto } from '../dtos/operation/create-operation.request.dto';
import { CreateOperationCommand } from '../commands/create-operation.command';
import { OperationResponseDto } from '../dtos/operation/operation.response.dto';
import { OperationMapper } from '../../infrastructure/mappers/operation.mapper';
import { DeleteOperationRequestDto } from '../dtos/operation/delete-operation.request.dto';
import { DeleteOperationCommand } from '../commands/delete-operation.command';
import { AggregateID } from 'libs/ddd/entity.base';

@Controller('v1')
export class DeleteOperationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly operationMapper: OperationMapper,
  ) {}

  @Delete('operation/delete')
  async delete(@Body() body: DeleteOperationRequestDto): Promise<AggregateID> {
    try {
      const command = DeleteOperationCommand.create(body);
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'DeleteOperationController.delete encountered an error',
        error,
      );
    }
  }
}
