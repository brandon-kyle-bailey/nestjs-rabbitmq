import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UserIntegrationEvents } from 'libs/events/user.events';
import { UserTokenResponseDto } from '../dtos/user-token.response.dto';
import { UserTokenMapper } from '../../infrastructure/mappers/user-token.mapper';
import { RefreshUserTokenRequestDto } from '../dtos/refresh-user-token.request.dto';
import { RefreshUserTokenCommand } from '../commands/refresh-user-token.command';

@Controller()
export class RefreshUserTokenEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: UserTokenMapper,
  ) {}

  @EventPattern(UserIntegrationEvents.RefreshToken)
  async create(
    @Payload() payload: RefreshUserTokenRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<UserTokenResponseDto> {
    try {
      const command = RefreshUserTokenCommand.create(payload);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'RefreshUserTokenEventController.create encountered an error',
        error,
      );
    }
  }
}
