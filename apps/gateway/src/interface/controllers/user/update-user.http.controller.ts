import { Body, Controller, Logger, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserMapper } from 'apps/gateway/src/infrastructure/mappers/user.mapper';
import { UpdateUserCommand } from '../../commands/user/update-user.command';
import { UpdateUserRequestDto } from '../../dtos/user/update-user.request.dto';
import { UserResponseDto } from '../../dtos/user/user.response.dto';

@Controller('v1')
export class UpdateUserController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: UserMapper,
  ) {}

  @Put('user')
  async update(@Body() body: UpdateUserRequestDto): Promise<UserResponseDto> {
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
