import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import axios, { AxiosError } from 'axios';
import { RunTaskCommand } from 'apps/task-runner/src/interface/commands/run-task.command';
import { TaskRepository } from '../ports/task/task.repository';
import { TaskRepositoryPort } from '../ports/task/task.repository.port';
import { TaskEntity } from '../../domain/entities/task.entity';

axios.interceptors.request.use(
  function (config) {
    config.headers.requestStartTime = Date.now();
    return config;
  },
  null,
  { synchronous: true },
);

axios.interceptors.response.use(
  function (response) {
    response.headers.duration =
      Date.now() - response.config.headers.requestStartTime;
    return response;
  },
  null,
  { synchronous: true },
);

@CommandHandler(RunTaskCommand)
export class RunTaskService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(TaskRepository)
    protected readonly repo: TaskRepositoryPort,
    protected readonly httpService: HttpService,
  ) {}

  async execute(command: RunTaskCommand): Promise<TaskEntity> {
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`${command.protocol}://${command.host}:${command.port}`)
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw error.response.status;
            }),
          ),
      );

      const {
        status,
        headers: { duration },
        data,
      } = response;

      const task = TaskEntity.create({
        status,
        duration,
        scheduledTaskId: command.scheduledTaskId,
        response: data,
      });

      await this.repo.transaction(async () => this.repo.insert(task));
      return task;
    } catch (error) {
      this.logger.error('RunTaskService.execute encountered an error', error);
    }
  }
}
