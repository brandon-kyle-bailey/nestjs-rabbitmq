import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { OperationCreatedDomainEvent } from '../../domain/entities/operation.entity';
import { OperationIntegrationEvents } from 'libs/events/operation.events';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';

@Injectable()
export class ScheduleOperationService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(TransportAdapterNames.TransportSchedulerAdapterService)
    protected service: ClientProxy,
    protected readonly logger: Logger,
  ) {}
  async onModuleInit() {
    await this.service.connect();
  }
  async onModuleDestroy() {
    await this.service.close();
  }

  @OnEvent(OperationCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OperationCreatedDomainEvent): Promise<any> {
    this.logger.debug(
      'ScheduleOperationService.handle called with event',
      JSON.stringify(event),
    );
    // TODO... create payload interface
    this.service.emit(OperationIntegrationEvents.Schedule, {
      operationId: event.aggregateId,
      type: 'interval',
      interval: event.interval,
      active: true,
    });
  }
}
