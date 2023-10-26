import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';
import { CreateScheduledTaskCommand } from 'apps/gateway/src/interface/commands/scheduled-task/create-scheduled-task.command';
import { ScheduledTaskEntity } from '../../../domain/entities/scheduled-task.entity';
import { ScheduledTaskRepository } from '../../ports/scheduled-task/scheduled-task.repository';
import { ScheduledTaskRepositoryPort } from '../../ports/scheduled-task/scheduled-task.repository.port';
import { WorkspaceRepository } from '../../ports/workspace/workspace.repository';
import { WorkspaceRepositoryPort } from '../../ports/workspace/workspace.repository.port';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ScheduledTaskIntegrationEvents } from 'libs/events/scheduled-task.events';

@CommandHandler(CreateScheduledTaskCommand)
export class CreateScheduledTaskService
  implements ICommandHandler, OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduledTaskRepository)
    protected readonly repo: ScheduledTaskRepositoryPort,
    @Inject(UserRepository)
    protected readonly userRepo: UserRepositoryPort,
    @Inject(WorkspaceRepository)
    protected readonly workspaceRepo: WorkspaceRepositoryPort,
    @Inject(TransportAdapterNames.TransportSchedulerAdapterService)
    private readonly service: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.service.connect();
  }
  async onModuleDestroy() {
    await this.service.close();
  }
  async execute(
    command: CreateScheduledTaskCommand,
  ): Promise<ScheduledTaskEntity> {
    try {
      const owner = await this.userRepo.findOneById(command.ownerId);
      const workspace = await this.workspaceRepo.findOneById(
        command.workspaceId,
      );
      const task = ScheduledTaskEntity.create({
        owner,
        workspace,
        ownerId: command.ownerId,
        workspaceId: command.workspaceId,
        name: command.name,
        protocol: command.protocol,
        host: command.host,
        port: command.port,
        interval: command.interval,
        type: command.type,
        active: command.active,
        payload: command.payload,
      });
      await this.repo.transaction(async () => {
        this.repo.insert(task);
        await firstValueFrom(
          this.service.emit(ScheduledTaskIntegrationEvents.CreateSchedule, {
            scheduledTaskId: task.id,
            protocol: command.protocol,
            host: command.host,
            port: command.port,
            interval: command.interval,
            type: command.type,
            active: command.active,
            payload: command.payload,
          }),
        );
      });
      return task;
    } catch (error) {
      this.logger.error(
        'CreateScheduledTaskService.execute encountered an error',
        error,
      );
    }
  }
}
