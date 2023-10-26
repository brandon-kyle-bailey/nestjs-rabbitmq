import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserTokenCommand } from 'apps/auth/src/interface/commands/create-user-token.command';
import { UserTokenEntity } from '../../domain/entities/user-token.entity';
import { JwtService } from '@nestjs/jwt';
import configuration from 'libs/config/configuration';

const {
  services: {
    auth: {
      web: { refresh_token_refresh },
    },
  },
} = configuration();

@CommandHandler(CreateUserTokenCommand)
export class CreateUserTokenService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    private readonly service: JwtService,
  ) {}
  async execute(command: CreateUserTokenCommand): Promise<UserTokenEntity> {
    try {
      const access_token = await this.service.signAsync({
        sub: command.id,
        username: command.name,
        email: command.email,
        role: command.role,
      });

      const refresh_token = await this.service.signAsync(
        {
          sub: command.id,
          username: command.name,
          email: command.email,
          role: command.role,
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
        'CreateUserTokenService.execute encountered an error',
        error,
      );
    }
  }
}
