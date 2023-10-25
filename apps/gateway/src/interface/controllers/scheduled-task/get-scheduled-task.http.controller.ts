import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { ScheduledTaskMapper } from 'apps/gateway/src/infrastructure/mappers/scheduled-task.mapper';
import { GetScheduledTaskRequestDto } from '../../dtos/scheduled-task/get-scheduled-task.request.dto';
import { ScheduledTaskResponseDto } from '../../dtos/scheduled-task/scheduled-task.response.dto';
import { GetScheduledTaskQuery } from '../../queries/scheduled-task/get-scheduled-task.query';

@Controller('v1')
export class GetScheduledTaskController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: ScheduledTaskMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('scheduled-task')
  async get(
    @Body() body: GetScheduledTaskRequestDto,
    @Req() request: any,
  ): Promise<ScheduledTaskResponseDto> {
    try {
      const query = GetScheduledTaskQuery.create({
        id: body.id,
      });
      const result = await this.queryBus.execute(query);
      const response = this.mapper.toResponse(result);
      return response;
    } catch (error) {
      this.logger.error(
        'GetScheduledTaskController.get encountered an error',
        error,
      );
    }
  }
}
