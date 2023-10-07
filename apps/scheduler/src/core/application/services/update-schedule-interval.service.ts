import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ScheduleEntity,
  ScheduleType,
} from '../../domain/entities/schedule.entity';
import { ScheduleRepository } from '../ports/schedule/schedule.repository';
import { ScheduleRepositoryPort } from '../ports/schedule/schedule.repository.port';
import { UpdateScheduleIntervalCommand } from 'apps/scheduler/src/interface/commands/update-schedule-interval.command';

@CommandHandler(UpdateScheduleIntervalCommand)
export class UpdateScheduleIntervalService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduleRepository)
    protected readonly scheduleRepository: ScheduleRepositoryPort,
  ) {}

  async execute(
    command: UpdateScheduleIntervalCommand,
  ): Promise<ScheduleEntity> {
    try {
      const schedule = await this.scheduleRepository.findOneByOperationId(
        command.operationId,
      );
      schedule.unload();
      schedule.setInterval(command.interval);
      schedule.load();
      await this.scheduleRepository.transaction(async () =>
        this.scheduleRepository.save(schedule),
      );
      return schedule;
    } catch (error) {
      this.logger.error(
        'UpdateScheduleIntervalService.execute encountered an error',
        error,
      );
    }
  }
}
