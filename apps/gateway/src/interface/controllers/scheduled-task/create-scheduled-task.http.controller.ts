import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { ScheduledTaskMapper } from 'apps/gateway/src/infrastructure/mappers/scheduled-task.mapper';
import { CreateScheduledTaskRequestDto } from '../../dtos/scheduled-task/create-scheduled-task.request.dto';
import { ScheduledTaskResponseDto } from '../../dtos/scheduled-task/scheduled-task.response.dto';
import { CreateScheduledTaskCommand } from '../../commands/scheduled-task/create-scheduled-task.command';

@Controller('v1')
export class CreateScheduledTaskController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: ScheduledTaskMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Post('scheduled-task')
  async create(
    @Body() body: CreateScheduledTaskRequestDto,
    @Req() request: any,
  ): Promise<ScheduledTaskResponseDto> {
    try {
      const command = CreateScheduledTaskCommand.create({
        ...body,
        ownerId: request.user.sub,
      });
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreateScheduledTaskController.create encountered an error',
        error,
      );
    }
  }
}
