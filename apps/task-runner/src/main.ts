import { NestFactory } from '@nestjs/core';
import { TaskRunnerModule } from './task-runner.module';

async function bootstrap() {
  const app = await NestFactory.create(TaskRunnerModule);
  await app.listen(3000);
}
bootstrap();
