import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserMapper } from 'apps/gateway/src/infrastructure/mappers/user.mapper';
import { UserResponseDto } from '../../dtos/user/user.response.dto';
import { CreateUserCommand } from '../../commands/user/create-user.command';
import { CreateUserRequestDto } from '../../dtos/user/create-user.request.dto';

@Controller('v1')
export class CreateUserController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: UserMapper,
  ) {}

  @Post('user')
  async create(@Body() body: CreateUserRequestDto): Promise<UserResponseDto> {
    try {
      const command = CreateUserCommand.create(body);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreateUserController.create encountered an error',
        error,
      );
    }
  }
}
