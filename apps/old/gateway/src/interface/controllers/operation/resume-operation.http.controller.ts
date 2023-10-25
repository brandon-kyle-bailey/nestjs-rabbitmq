import {
  Body,
  Controller,
  Delete,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AggregateID } from 'libs/ddd/entity.base';
import { ResumeOperationRequestDto } from '../../dtos/operation/resume-operation.request.dto';
import { ResumeOperationCommand } from '../../commands/operation/resume-operation.command';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';

@Controller('v1')
export class ResumeOperationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard)
  @Post('operation/resume')
  async resume(
    @Body() body: ResumeOperationRequestDto,
    @Req() request: any,
  ): Promise<AggregateID> {
    try {
      const command = ResumeOperationCommand.create(body);
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'ResumeOperationController.resume encountered an error',
        error,
      );
    }
  }
}
