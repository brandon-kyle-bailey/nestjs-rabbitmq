import { Body, Controller, Logger, Put, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { ScheduledTaskMapper } from 'apps/gateway/src/infrastructure/mappers/scheduled-task.mapper';
import { ScheduledTaskResponseDto } from '../../dtos/scheduled-task/scheduled-task.response.dto';
import { UpdateScheduledTaskRequestDto } from '../../dtos/scheduled-task/update-scheduled-task.request.dto';
import { UpdateScheduledTaskCommand } from '../../commands/scheduled-task/update-scheduled-task.command';

@Controller('v1')
export class UpdateScheduledTaskController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: ScheduledTaskMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Put('scheduled-task')
  async update(
    @Body() body: UpdateScheduledTaskRequestDto,
    @Req() request: any,
  ): Promise<ScheduledTaskResponseDto> {
    try {
      const command = UpdateScheduledTaskCommand.create(body);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'UpdateScheduledTaskController.update encountered an error',
        error,
      );
    }
  }
}
