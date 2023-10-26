import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ScheduleEntity } from '../../domain/entities/schedule.entity';
import { ScheduleRepository } from '../ports/schedule/schedule.repository';
import { ScheduleRepositoryPort } from '../ports/schedule/schedule.repository.port';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PickupSchedulesCommand } from 'apps/schedule-orchestrator/src/interface/commands/pickup-schedules.command';

@CommandHandler(PickupSchedulesCommand)
export class PickupSchedulesService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduleRepository)
    protected readonly repo: ScheduleRepositoryPort,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: PickupSchedulesCommand): Promise<void> {
    try {
      this.logger.debug('PickupSchedulesService.execute called');
      const schedules = await this.repo.findAllActive();
      schedules.map(async (schedule: ScheduleEntity) => {
        schedule.load();
        await schedule.publishEvents(this.logger, this.eventEmitter);
      });
      return;
    } catch (error) {
      this.logger.error(
        'PickupSchedulesService.execute encountered an error',
        error,
      );
    }
  }
}
