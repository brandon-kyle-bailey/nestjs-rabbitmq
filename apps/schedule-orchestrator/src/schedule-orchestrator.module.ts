import { Module } from '@nestjs/common';
import { ScheduleOrchestratorController } from './schedule-orchestrator.controller';
import { ScheduleOrchestratorService } from './schedule-orchestrator.service';

@Module({
  imports: [],
  controllers: [ScheduleOrchestratorController],
  providers: [ScheduleOrchestratorService],
})
export class ScheduleOrchestratorModule {}
