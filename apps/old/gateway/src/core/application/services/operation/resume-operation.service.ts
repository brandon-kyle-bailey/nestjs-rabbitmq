import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateID } from 'libs/ddd/entity.base';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { ClientProxy } from '@nestjs/microservices';
import { OperationIntegrationEvents } from 'libs/events/operation.events';
import { ResumeOperationCommand } from 'apps/gateway/src/interface/commands/operation/resume-operation.command';

@CommandHandler(ResumeOperationCommand)
export class ResumeOperationService
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
  async execute(command: ResumeOperationCommand): Promise<AggregateID> {
    try {
      this.logger.debug(
        'ResumeOperationService.execute called with command',
        JSON.stringify(command),
      );
      // TODO... create payload interface
      const result = this.service.emit(OperationIntegrationEvents.Resume, {
        operationId: command.id,
      });
      return command.id;
    } catch (error) {
      this.logger.error(
        'ResumeOperationService.execute encountered an error',
        error,
      );
    }
  }
}
