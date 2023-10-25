import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteScheduleCommand } from 'apps/scheduler/src/interface/commands/delete-schedule.command';
import { AggregateID } from 'libs/ddd/entity.base';
import { ScheduleRepository } from '../ports/schedule/schedule.repository';
import { ScheduleRepositoryPort } from '../ports/schedule/schedule.repository.port';

@CommandHandler(DeleteScheduleCommand)
export class DeleteScheduleService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduleRepository)
    protected readonly scheduleRepository: ScheduleRepositoryPort,
  ) {}

  async execute(command: DeleteScheduleCommand): Promise<AggregateID> {
    try {
      this.logger.debug(
        `DeleteScheduleService.execute invoked with command`,
        command,
      );
      this.logger.debug(command.operationId);
      await this.scheduleRepository.transaction(async () => {
        const schedule = await this.scheduleRepository.findOneByOperationId(
          command.operationId,
        );
        schedule.delete();
        schedule.unload();
        await this.scheduleRepository.delete(schedule);
      });
      return command.operationId;
    } catch (error) {
      this.logger.error(
        'DeleteScheduleService.execute encountered an error',
        error,
      );
    }
  }
}
