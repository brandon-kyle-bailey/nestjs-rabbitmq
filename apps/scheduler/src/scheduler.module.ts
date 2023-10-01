import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'libs/config/configuration';
import { CreateScheduleEventController } from './interface/controllers/create-schedule.event.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({ global: true }),
    HttpModule,
  ],
  controllers: [CreateScheduleEventController],
  providers: [Logger, ConfigService],
})
export class SchedulerModule {}
