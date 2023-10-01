import { HttpService } from '@nestjs/axios';
import { Controller, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';

import axios, { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

// TODO... seperate invoke handler into event processor service

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

@Controller()
export class CreateScheduleEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly eventEmitter: EventEmitter2,
    private readonly httpService: HttpService,
  ) {}

  @EventPattern('schedule')
  async create(
    @Payload() payload: any,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    this.logger.debug('CreateScheduledEventController.create called');
    const data = JSON.parse(payload);
    if (
      this.schedulerRegistry.doesExist(
        'interval',
        `${data.aggregateId}_scheduled_event`,
      )
    ) {
      this.logger.debug('interval already exists, returning');
      return;
    }
    this.logger.debug('adding interval for event', {
      id: data.aggregateId,
      interval: data.interval,
    });
    this.schedulerRegistry.addInterval(
      `${data.aggregateId}_scheduled_event`,
      setInterval(async () => {
        this.eventEmitter.emit('schedule.invoke', JSON.stringify(data));
      }, data.interval),
    );
  }

  @OnEvent('schedule.invoke', { async: true, promisify: true })
  async processEvent(payload: any) {
    this.logger.debug(
      'CreateScheduleEventController.processEvent called with payload',
      payload,
    );
    const data = JSON.parse(payload);
    const url = `${data.protocol}://${data.host}:${data.port}`;
    this.logger.debug('url to ping', url);
    const { status, headers } = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw error.response.status;
        }),
      ),
    );
    this.logger.debug(
      `CreateScheduleEventController.processEvent result status from ping`,
      status,
    );
    this.logger.debug(
      `CreateScheduleEventController.processEvent result duration from ping`,
      headers.duration,
    );
  }
}
