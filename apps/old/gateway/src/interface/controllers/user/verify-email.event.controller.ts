import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import { Payload } from '@nestjs/microservices';
import { UserCreatedDomainEvent } from 'apps/gateway/src/core/domain/entities/user.entity';
import { VerifyEmailRequestDto } from '../../dtos/user/verify-email.request.dto';
import { SendVerificationEmailCommand } from '../../commands/user/send-verification-email.command';

@Controller()
export class VerifyEmailEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @OnEvent(UserCreatedDomainEvent.name)
  async verify(@Payload() payload: VerifyEmailRequestDto): Promise<void> {
    try {
      const command = SendVerificationEmailCommand.create(payload);
      await this.commandBus.execute(command);
    } catch (error) {
      this.logger.error(
        'VerifyEmailEventController.verify encountered an error',
        error,
      );
    }
  }
}
