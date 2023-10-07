import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateID } from 'libs/ddd/entity.base';
import { ScheduleRepository } from '../ports/schedule/schedule.repository';
import { ScheduleRepositoryPort } from '../ports/schedule/schedule.repository.port';
import { PauseScheduleCommand } from 'apps/scheduler/src/interface/commands/pause-schedule.command';

@CommandHandler(PauseScheduleCommand)
export class PauseScheduleService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduleRepository)
    protected readonly scheduleRepository: ScheduleRepositoryPort,
  ) {}

  async execute(command: PauseScheduleCommand): Promise<AggregateID> {
    try {
      this.logger.debug(
        `PauseScheduleService.execute invoked with command`,
        command,
      );
      this.logger.debug(command.operationId);
      await this.scheduleRepository.transaction(async () => {
        const schedule = await this.scheduleRepository.findOneByOperationId(
          command.operationId,
        );
        schedule.pause();
        schedule.unload();
        await this.scheduleRepository.save(schedule);
      });
      return command.operationId;
    } catch (error) {
      this.logger.error(
        'PauseScheduleService.execute encountered an error',
        error,
      );
    }
  }
}
