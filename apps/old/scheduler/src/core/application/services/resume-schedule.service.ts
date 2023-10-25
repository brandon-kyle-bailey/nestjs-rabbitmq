import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateID } from 'libs/ddd/entity.base';
import { ScheduleRepository } from '../ports/schedule/schedule.repository';
import { ScheduleRepositoryPort } from '../ports/schedule/schedule.repository.port';
import { ResumeScheduleCommand } from 'apps/scheduler/src/interface/commands/resume-schedule.command';

@CommandHandler(ResumeScheduleCommand)
export class ResumeScheduleService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduleRepository)
    protected readonly scheduleRepository: ScheduleRepositoryPort,
  ) {}

  async execute(command: ResumeScheduleCommand): Promise<AggregateID> {
    try {
      this.logger.debug(
        `ResumeScheduleService.execute invoked with command`,
        command,
      );
      this.logger.debug(command.operationId);
      await this.scheduleRepository.transaction(async () => {
        const schedule = await this.scheduleRepository.findOneByOperationId(
          command.operationId,
        );
        schedule.resume();
        schedule.load();
        await this.scheduleRepository.save(schedule);
      });
      return command.operationId;
    } catch (error) {
      this.logger.error(
        'ResumeScheduleService.execute encountered an error',
        error,
      );
    }
  }
}
