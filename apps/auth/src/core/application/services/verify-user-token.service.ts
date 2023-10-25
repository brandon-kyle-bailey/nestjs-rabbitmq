import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { VerifyUserTokenCommand } from 'apps/auth/src/interface/commands/verify-user-token.command';
import configuration from 'libs/config/configuration';
import { UserTokenPayloadEntity } from '../../domain/entities/user-token-payload.entity';

const {
  services: {
    auth: {
      web: { secret },
    },
  },
} = configuration();

@CommandHandler(VerifyUserTokenCommand)
export class VerifyUserTokenService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    private readonly service: JwtService,
  ) {}
  async execute(
    command: VerifyUserTokenCommand,
  ): Promise<UserTokenPayloadEntity> {
    this.logger.debug(`VerifyUserTokenService.execute called with`, command);
    try {
      const rawPayload = await this.service.verifyAsync(command.access_token, {
        secret,
      });
      this.logger.debug(`raw payload`, rawPayload);
      const payload = UserTokenPayloadEntity.create({
        sub: rawPayload.sub,
        username: rawPayload.username,
        email: rawPayload.email,
        role: rawPayload.role,
      });
      return payload;
    } catch (error) {
      this.logger.error(
        'VerifyUserTokenService.execute encountered an error',
        error,
      );
    }
  }
}
