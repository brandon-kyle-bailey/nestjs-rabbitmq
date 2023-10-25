import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserMapper } from 'apps/gateway/src/infrastructure/mappers/user.mapper';
import { UserResponseDto } from '../../dtos/user/user.response.dto';
import { RefreshUserTokenCommand } from '../../commands/user/refresh-user-token.command';
import { RefreshUserTokenRequestDto } from '../../dtos/user/refresh-user-token.request.dto';

@Controller('v1')
export class RefreshUserTokenController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: UserMapper,
  ) {}

  @Post('user/refresh')
  async refresh(
    @Body() body: RefreshUserTokenRequestDto,
  ): Promise<UserResponseDto> {
    try {
      const command = RefreshUserTokenCommand.create(body);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'RefreshUserTokenController.refresh encountered an error',
        error,
      );
    }
  }
}
