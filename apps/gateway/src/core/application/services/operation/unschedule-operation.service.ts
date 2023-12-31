import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { OperationDeletedDomainEvent } from '../../../domain/entities/operation.entity';
import { OperationIntegrationEvents } from 'libs/events/operation.events';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';

@Injectable()
export class UnscheduleOperationService
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    protected readonly logger: Logger,
    @Inject(TransportAdapterNames.TransportSchedulerAdapterService)
    protected service: ClientProxy,
  ) {}
  async onModuleInit() {
    await this.service.connect();
  }
  async onModuleDestroy() {
    await this.service.close();
  }

  @OnEvent(OperationDeletedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OperationDeletedDomainEvent): Promise<any> {
    this.logger.debug(
      'UnscheduleOperationService.handle called with event',
      JSON.stringify(event),
    );
    // TODO... create payload interface
    const result = this.service.emit(OperationIntegrationEvents.Unschedule, {
      operationId: event.aggregateId,
    });
  }
}
