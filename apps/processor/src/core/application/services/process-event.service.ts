import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProcessEventCommand } from 'apps/processor/src/interface/commands/process-event.command';
import { ProcessEventEntity } from '../../domain/entities/process-event.entity';
import { ProcessEventRepository } from '../ports/process-event/process-event.repository';
import { ProcessEventRepositoryPort } from '../ports/process-event/process-event.repository.port';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import axios, { AxiosError } from 'axios';
import { ClientProxy } from '@nestjs/microservices';
import { AdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { OperationIntegrationEvents } from 'libs/events/operation.events';

axios.interceptors.request.use(
  function (config) {
    config.headers.requestStartTime = Date.now();
    return config;
  },
  null,
  { synchronous: true },
);

axios.interceptors.response.use(
  function (response) {
    response.headers.duration =
      Date.now() - response.config.headers.requestStartTime;
    return response;
  },
  null,
  { synchronous: true },
);

@CommandHandler(ProcessEventCommand)
export class ProcessEventService
  implements ICommandHandler, OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly logger: Logger,
    @Inject(ProcessEventRepository)
    protected readonly repo: ProcessEventRepositoryPort,
    @Inject(AdapterNames.GatewayService)
    protected gatewayService: ClientProxy,
    protected readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    await this.gatewayService.connect();
  }
  async onModuleDestroy() {
    await this.gatewayService.close();
  }
  async execute(command: ProcessEventCommand): Promise<ProcessEventEntity> {
    try {
      const { protocol, host, port } = await firstValueFrom(
        this.gatewayService.send(OperationIntegrationEvents.Get, {
          id: command.operationId,
        }),
      );

      const {
        status,
        headers: { duration },
      } = await firstValueFrom(
        this.httpService.get(`${protocol}://${host}:${port}`).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw error.response.status;
          }),
        ),
      );

      const processEvent = ProcessEventEntity.create({
        operationId: command.operationId,
        status,
        duration,
      });

      await this.repo.transaction(async () => this.repo.insert(processEvent));
      return processEvent;
    } catch (error) {
      this.logger.error(
        'ProcessEventService.execute encountered an error',
        error,
      );
    }
  }
}
