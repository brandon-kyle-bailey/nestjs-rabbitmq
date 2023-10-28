import { OnModuleInit, OnModuleDestroy, Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { PromoteTaskResultToIncidentWatcherCommand } from 'apps/task-runner/src/interface/commands/promote-task-result-to-incident-watcher.command';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { TaskIntegrationEvents } from 'libs/events/task.events';

@CommandHandler(PromoteTaskResultToIncidentWatcherCommand)
export class PromoteTaskResultToIncidentWatcherService
  implements ICommandHandler, OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly logger: Logger,
    @Inject(TransportAdapterNames.TransportIncidentWatcherAdapterService)
    private readonly service: ClientProxy,
  ) {}
  async onModuleInit() {
    await this.service.connect();
  }
  async onModuleDestroy() {
    await this.service.close();
  }
  async execute(
    command: PromoteTaskResultToIncidentWatcherCommand,
  ): Promise<void> {
    try {
      const payload = {
        scheduledTaskId: command.scheduledTaskId,
        status: command.status,
        duration: command.duration,
        response: command.response,
        createdAt: command.createdAt,
      };
      this.logger.debug(
        'sending the following event to the incident watcher service',
        { name: TaskIntegrationEvents.Complete },
      );
      this.service.send(TaskIntegrationEvents.Complete, payload).subscribe();
    } catch (error) {
      this.logger.error(
        'PromoteTaskResultToIncidentWatcherService.execute encountered an error',
        error,
      );
    }
  }
}
