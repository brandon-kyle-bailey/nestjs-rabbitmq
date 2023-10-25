import { NestFactory } from '@nestjs/core';
import { ScheduleOrchestratorModule } from './schedule-orchestrator.module';

async function bootstrap() {
  const app = await NestFactory.create(ScheduleOrchestratorModule);
  await app.listen(3000);
}
bootstrap();
