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
import { OperationCreatedDomainEvent } from '../../domain/entities/operation.entity';

@Injectable()
export class ScheduleOperationService implements OnModuleInit, OnModuleDestroy {
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

  @OnEvent(OperationCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OperationCreatedDomainEvent): Promise<any> {
    this.logger.debug(
      'ScheduleOperationService.handle called with event',
      JSON.stringify(event),
    );
    const result = this.schedulerService.emit(
      'schedule',
      JSON.stringify(event),
    );
  }
}
