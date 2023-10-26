import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ScheduleEntity } from '../../domain/entities/schedule.entity';
import { ScheduleRepository } from '../ports/schedule/schedule.repository';
import { ScheduleRepositoryPort } from '../ports/schedule/schedule.repository.port';
import { CreateScheduleCommand } from 'apps/schedule-orchestrator/src/interface/commands/create-schedule.command';

@CommandHandler(CreateScheduleCommand)
export class CreateScheduleService implements ICommandHandler {
  constructor(
    protected readonly logger: Logger,
    @Inject(ScheduleRepository)
    protected readonly repo: ScheduleRepositoryPort,
  ) {}
  async execute(command: CreateScheduleCommand): Promise<ScheduleEntity> {
    try {
      const schedule = ScheduleEntity.create({
        scheduledTaskId: command.scheduledTaskId,
        protocol: command.protocol,
        host: command.host,
        port: command.port,
        interval: command.interval,
        type: command.type,
        active: command.active,
        payload: command.payload,
      });

      schedule.load();
      await this.repo.transaction(async () => {
        this.repo.insert(schedule);
      });
      return schedule;
    } catch (error) {
      this.logger.error(
        'CreateScheduleService.execute encountered an error',
        error,
      );
    }
  }
}
