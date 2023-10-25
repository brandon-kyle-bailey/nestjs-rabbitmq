import {
  Body,
  Controller,
  Get,
  Logger,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserMapper } from 'apps/gateway/src/infrastructure/mappers/user.mapper';
import { UserResponseDto } from '../../dtos/user/user.response.dto';
import { AuthGuard } from 'apps/gateway/src/core/application/services/auth/auth.guard';
import { VeriyUserRequestDto } from '../../dtos/user/verfiy-user.request.dto';
import { UpdateUserCommand } from '../../commands/user/update-user.command';
import { UpdateUserRequestDto } from '../../dtos/user/update-user.request.dto';

@Controller('v1')
export class VeriyUserController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: UserMapper,
  ) {}

  @Get('user/verify')
  async verify(
    // @Body() body: VeriyUserRequestDto,
    @Query() query: VeriyUserRequestDto,
    @Req() request: any,
  ): Promise<void> {
    try {
      const command = UpdateUserCommand.create({
        userId: query.id,
        verified: true,
      } as UpdateUserRequestDto);
      const result = await this.commandBus.execute(command);
    } catch (error) {
      this.logger.error(
        'VeriyUserController.verify encountered an error',
        error,
      );
    }
  }
}
