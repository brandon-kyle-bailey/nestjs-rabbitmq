import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { UserIntegrationEvents } from 'libs/events/user.events';

@Controller()
export class UserTokenGenerateEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: UserTokenMapper,
  ) {}

  @EventPattern(UserIntegrationEvents.GenerateToken)
  async create(
    @Payload() payload: UserTokenGenerateRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<UserTokenGenerateResponseDto> {
    try {
      const command = UserTokenGenerateCommand.create({
        operationId: payload.operationId,
      });
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'UserTokenGenerateEventController.create encountered an error',
        error,
      );
    }
  }
}
