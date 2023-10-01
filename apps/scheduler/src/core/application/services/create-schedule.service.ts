import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ScheduleEntity } from '../../domain/entities/schedule.entity';
import { CreateScheduleCommand } from 'apps/scheduler/src/interface/commands/create-schedule.command';
import { ScheduleRepository } from '../ports/schedule/schedule.repository';
import { ScheduleRepositoryPort } from '../ports/schedule/schedule.repository.port';

@CommandHandler(CreateScheduleCommand)
export class CreateScheduleService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduleRepository)
    protected readonly scheduleRepository: ScheduleRepositoryPort,
  ) {}
  async execute(command: CreateScheduleCommand): Promise<ScheduleEntity> {
    try {
      const schedule = ScheduleEntity.create({
        name: command.name,
        protocol: command.protocol,
        host: command.host,
        port: command.port,
        interval: command.interval,
      });
      await this.scheduleRepository.transaction(async () =>
        this.scheduleRepository.insert(schedule),
      );
      return schedule;
    } catch (error) {
      this.logger.error(
        'CreateScheduleService.execute encountered an error',
        error,
      );
    }
  }
}
