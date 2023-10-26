import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteScheduledTaskCommand } from 'apps/gateway/src/interface/commands/scheduled-task/delete-scheduled-task.command';
import { AggregateID } from 'libs/ddd/entity.base';
import { ScheduledTaskRepository } from '../../ports/scheduled-task/scheduled-task.repository';
import { ScheduledTaskRepositoryPort } from '../../ports/scheduled-task/scheduled-task.repository.port';
import { ClientProxy } from '@nestjs/microservices';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { firstValueFrom } from 'rxjs';
import { ScheduledTaskIntegrationEvents } from 'libs/events/scheduled-task.events';

// TODO... only delete scheduled task the user is an owner of

@CommandHandler(DeleteScheduledTaskCommand)
export class DeleteScheduledTaskService
  implements ICommandHandler, OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduledTaskRepository)
    protected readonly repo: ScheduledTaskRepositoryPort,
    @Inject(TransportAdapterNames.TransportSchedulerAdapterService)
    private readonly service: ClientProxy,
  ) {}
  async onModuleInit() {
    await this.service.connect();
  }
  async onModuleDestroy() {
    await this.service.close();
  }
  async execute(command: DeleteScheduledTaskCommand): Promise<AggregateID> {
    try {
      await this.repo.transaction(async () => {
        const task = await this.repo.findOneById(command.id);
        task.delete();
        await this.repo.delete(task);
        await firstValueFrom(
          this.service.emit(ScheduledTaskIntegrationEvents.DeleteSchedule, {
            scheduledTaskId: task.id,
          }),
        );
      });
      return command.id;
    } catch (error) {
      this.logger.error(
        'DeleteScheduledTaskService.execute encountered an error',
        error,
      );
    }
  }
}
