import {
  Body,
  Controller,
  Delete,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AggregateID } from 'libs/ddd/entity.base';
import { UpdateOperationIntervalCommand } from '../../commands/operation/update-operation-interval.command';
import { UpdateOperationIntervalRequestDto } from '../../dtos/operation/update-operation-interval.request.dto';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';

@Controller('v1')
export class UpdateOperationIntervalController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard)
  @Post('operation/interval/update')
  async pause(
    @Body() body: UpdateOperationIntervalRequestDto,
  ): Promise<AggregateID> {
    try {
      const command = UpdateOperationIntervalCommand.create(body);
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'UpdateOperationIntervalController.pause encountered an error',
        error,
      );
    }
  }
}
