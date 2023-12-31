import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import configuration from 'libs/config/configuration';
import { CreateUserTokenEventController } from './interface/controllers/create-user-token.event.controller';
import { CreateUserTokenService } from './core/application/services/create-user-token.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserTokenMapper } from './infrastructure/mappers/user-token.mapper';
import { VerifyUserTokenEventController } from './interface/controllers/verify-user-token.event.controller';
import { UserTokenPayloadMapper } from './infrastructure/mappers/user-token-payload.mapper';
import { VerifyUserTokenService } from './core/application/services/verify-user-token.service';

const {
  services: {
    auth: {
      web: { secret },
    },
  },
} = configuration();

const controllers = [
  CreateUserTokenEventController,
  VerifyUserTokenEventController,
];

const mappers = [UserTokenMapper, UserTokenPayloadMapper];

const services = [CreateUserTokenService, VerifyUserTokenService];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule.register({
      global: true,
      secret: secret,
      signOptions: { expiresIn: '30m' },
    }),
    CqrsModule,
    EventEmitterModule.forRoot({ global: true }),
  ],
  controllers,
  providers: [Logger, ConfigService, ...mappers, ...services],
})
export class AuthModule {}
