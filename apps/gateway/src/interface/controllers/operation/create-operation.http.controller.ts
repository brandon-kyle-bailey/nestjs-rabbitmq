import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOperationRequestDto } from '../../dtos/operation/create-operation.request.dto';
import { CreateOperationCommand } from '../../commands/operation/create-operation.command';
import { OperationResponseDto } from '../../dtos/operation/operation.response.dto';
import { OperationMapper } from '../../../infrastructure/mappers/operation.mapper';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';

@Controller('v1')
export class CreateOperationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly operationMapper: OperationMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Post('operation')
  async create(
    @Body() body: CreateOperationRequestDto,
    @Req() request: any,
  ): Promise<OperationResponseDto> {
    try {
      const command = CreateOperationCommand.create(body);
      const result = await this.commandBus.execute(command);
      return this.operationMapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreateOperationController.create encountered an error',
        error,
      );
    }
  }
}
