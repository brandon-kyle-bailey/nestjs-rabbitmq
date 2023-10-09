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
import { PauseOperationRequestDto } from '../../dtos/operation/pause-operation.request.dto';
import { PauseOperationCommand } from '../../commands/operation/pause-operation.command';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';

@Controller('v1')
export class PauseOperationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard)
  @Post('operation/pause')
  async pause(@Body() body: PauseOperationRequestDto): Promise<AggregateID> {
    try {
      const command = PauseOperationCommand.create(body);
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'PauseOperationController.pause encountered an error',
        error,
      );
    }
  }
}
