import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import configuration from 'libs/config/configuration';
import { RefreshUserTokenCommand } from 'apps/auth/src/interface/commands/refresh-user-token.command';
import { UserTokenEntity } from '../../domain/entities/user-token.entity';

const {
  services: {
    auth: {
      web: { secret, refresh_token_refresh },
    },
  },
} = configuration();

@CommandHandler(RefreshUserTokenCommand)
export class RefreshUserTokenService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    private readonly service: JwtService,
  ) {}
  async execute(command: RefreshUserTokenCommand): Promise<UserTokenEntity> {
    this.logger.debug(`RefreshUserTokenService.execute called with`, command);
    try {
      const rawPayload = await this.service.verifyAsync(command.refresh_token, {
        secret,
      });
      this.logger.debug(`raw payload`, rawPayload);
      const access_token = await this.service.signAsync({
        sub: rawPayload.sub,
        username: rawPayload.name,
        email: rawPayload.email,
        role: rawPayload.role,
      });

      const refresh_token = await this.service.signAsync(
        {
          sub: rawPayload.sub,
          username: rawPayload.name,
          email: rawPayload.email,
          role: rawPayload.role,
        },
        { expiresIn: refresh_token_refresh },
      );
      const token = UserTokenEntity.create({
        access_token,
        refresh_token,
      });
      return token;
    } catch (error) {
      this.logger.error(
        'RefreshUserTokenService.execute encountered an error',
        error,
      );
    }
  }
}
