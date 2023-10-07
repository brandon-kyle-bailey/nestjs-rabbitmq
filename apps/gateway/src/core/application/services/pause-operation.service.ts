import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateID } from 'libs/ddd/entity.base';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { ClientProxy } from '@nestjs/microservices';
import { PauseOperationCommand } from 'apps/gateway/src/interface/commands/pause-operation.command';
import { OperationIntegrationEvents } from 'libs/events/operation.events';

@CommandHandler(PauseOperationCommand)
export class PauseOperationService
  implements ICommandHandler, OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly logger: Logger,
    @Inject(TransportAdapterNames.TransportSchedulerAdapterService)
    protected service: ClientProxy,
  ) {}
  async onModuleInit() {
    await this.service.connect();
  }
  async onModuleDestroy() {
    await this.service.close();
  }
  async execute(command: PauseOperationCommand): Promise<AggregateID> {
    try {
      this.logger.debug(
        'PauseOperationService.execute called with command',
        JSON.stringify(command),
      );
      // TODO... create payload interface
      const result = this.service.emit(OperationIntegrationEvents.Pause, {
        operationId: command.id,
      });
      return command.id;
    } catch (error) {
      this.logger.error(
        'PauseOperationService.execute encountered an error',
        error,
      );
    }
  }
}
