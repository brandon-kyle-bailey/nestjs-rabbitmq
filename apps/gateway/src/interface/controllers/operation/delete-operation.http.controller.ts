import { Body, Controller, Delete, Logger, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AggregateID } from 'libs/ddd/entity.base';
import { DeleteOperationRequestDto } from '../../dtos/operation/delete-operation.request.dto';
import { DeleteOperationCommand } from '../../commands/operation/delete-operation.command';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';

@Controller('v1')
export class DeleteOperationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard)
  @Delete('operation')
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
