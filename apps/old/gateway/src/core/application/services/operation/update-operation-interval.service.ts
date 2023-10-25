import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateID } from 'libs/ddd/entity.base';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { ClientProxy } from '@nestjs/microservices';
import { OperationIntegrationEvents } from 'libs/events/operation.events';
import { UpdateOperationIntervalCommand } from 'apps/gateway/src/interface/commands/operation/update-operation-interval.command';

@CommandHandler(UpdateOperationIntervalCommand)
export class UpdateOperationIntervalService
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
  async execute(command: UpdateOperationIntervalCommand): Promise<AggregateID> {
    try {
      this.logger.debug(
        'UpdateOperationIntervalService.execute called with command',
        JSON.stringify(command),
      );
      // TODO... create payload interface
      const result = this.service.emit(
        OperationIntegrationEvents.UpdateInterval,
        {
          operationId: command.id,
          interval: command.interval,
        },
      );
      return command.id;
    } catch (error) {
      this.logger.error(
        'UpdateOperationIntervalService.execute encountered an error',
        error,
      );
    }
  }
}
