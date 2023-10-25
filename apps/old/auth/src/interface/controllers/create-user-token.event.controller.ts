import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { UserIntegrationEvents } from 'libs/events/user.events';
import { UserTokenResponseDto } from '../dtos/user-token.response.dto';
import { CreateUserTokenRequestDto } from '../dtos/create-user-token.request.dto';
import { CreateUserTokenCommand } from '../commands/create-user-token.command';
import { UserTokenMapper } from '../../infrastructure/mappers/user-token.mapper';

@Controller()
export class CreateUserTokenEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: UserTokenMapper,
  ) {}

  @EventPattern(UserIntegrationEvents.CreateToken)
  async create(
    @Payload() payload: CreateUserTokenRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<UserTokenResponseDto> {
    try {
      const command = CreateUserTokenCommand.create(payload);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreateUserTokenEventController.create encountered an error',
        error,
      );
    }
  }
}
