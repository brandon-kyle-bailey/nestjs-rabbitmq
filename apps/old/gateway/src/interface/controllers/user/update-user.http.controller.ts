import { Body, Controller, Logger, Put, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserMapper } from 'apps/gateway/src/infrastructure/mappers/user.mapper';
import { UpdateUserCommand } from '../../commands/user/update-user.command';
import { UpdateUserRequestDto } from '../../dtos/user/update-user.request.dto';
import { UserResponseDto } from '../../dtos/user/user.response.dto';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';

@Controller('v1')
export class UpdateUserController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: UserMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Put('user')
  async update(
    @Body() body: UpdateUserRequestDto,
    @Req() request: any,
  ): Promise<UserResponseDto> {
    try {
      const command = UpdateUserCommand.create(body);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'UpdateUserController.update encountered an error',
        error,
      );
    }
  }
}
