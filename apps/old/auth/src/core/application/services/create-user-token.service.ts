import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserTokenCommand } from 'apps/auth/src/interface/commands/create-user-token.command';
import { UserTokenEntity } from '../../domain/entities/user-token.entity';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(CreateUserTokenCommand)
export class CreateUserTokenService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    private readonly service: JwtService,
  ) {}
  async execute(command: CreateUserTokenCommand): Promise<UserTokenEntity> {
    try {
      // TODO... reach out to gateway service to verify user passwords match before creating token
      const rawToken = await this.service.signAsync({
        sub: command.id,
        username: command.name,
        email: command.email,
      });
      const token = UserTokenEntity.create({
        access_token: rawToken,
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
