import { Body, Controller, Delete, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AggregateID } from 'libs/ddd/entity.base';
import { ResumeOperationRequestDto } from '../dtos/operation/resume-operation.request.dto';
import { ResumeOperationCommand } from '../commands/resume-operation.command';

@Controller('v1')
export class ResumeOperationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @Post('operation/resume')
  async resume(@Body() body: ResumeOperationRequestDto): Promise<AggregateID> {
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
