import { Module } from '@nestjs/common';
import { TaskRunnerController } from './task-runner.controller';
import { TaskRunnerService } from './task-runner.service';

@Module({
  imports: [],
  controllers: [TaskRunnerController],
  providers: [TaskRunnerService],
})
export class TaskRunnerModule {}
