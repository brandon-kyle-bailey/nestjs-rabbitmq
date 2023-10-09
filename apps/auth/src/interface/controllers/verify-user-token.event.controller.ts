import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { UserIntegrationEvents } from 'libs/events/user.events';
import { VerifyUserTokenCommand } from '../commands/verify-user-token.command';
import { VerifyUserTokenRequestDto } from '../dtos/verify-user-token.request.dto';
import { UserTokenPayloadResponseDto } from '../dtos/user-token-payload.response.dto';
import { UserTokenPayloadMapper } from '../../infrastructure/mappers/user-token-payload.mapper';

@Controller()
export class VerifyUserTokenEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: UserTokenPayloadMapper,
  ) {}

  @EventPattern(UserIntegrationEvents.VerifyToken)
  async create(
    @Payload() payload: VerifyUserTokenRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<UserTokenPayloadResponseDto> {
    try {
      const command = VerifyUserTokenCommand.create(payload);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'VerifyUserTokenEventController.create encountered an error',
        error,
      );
    }
  }
}
