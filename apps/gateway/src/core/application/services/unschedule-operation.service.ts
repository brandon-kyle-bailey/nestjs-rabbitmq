import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { AdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { OperationDeletedDomainEvent } from '../../domain/entities/operation.entity';
import { OperationIntegrationEvents } from 'libs/events/operation.events';

@Injectable()
export class UnscheduleOperationService
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(AdapterNames.SchedulerService)
    protected schedulerService: ClientProxy,
    protected readonly logger: Logger,
  ) {}
  async onModuleInit() {
    await this.schedulerService.connect();
  }
  async onModuleDestroy() {
    await this.schedulerService.close();
  }

  @OnEvent(OperationDeletedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OperationDeletedDomainEvent): Promise<any> {
    this.logger.debug(
      'UnscheduleOperationService.handle called with event',
      JSON.stringify(event),
    );
    const result = this.schedulerService.emit(
      OperationIntegrationEvents.Unschedule,
      JSON.stringify(event),
    );
  }
}
