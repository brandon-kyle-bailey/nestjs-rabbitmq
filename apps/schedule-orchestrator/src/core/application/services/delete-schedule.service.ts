import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ScheduleRepository } from '../ports/schedule/schedule.repository';
import { ScheduleRepositoryPort } from '../ports/schedule/schedule.repository.port';
import { AggregateID } from 'libs/ddd/entity.base';
import { DeleteScheduleCommand } from 'apps/schedule-orchestrator/src/interface/commands/delete-schedule.command';

@CommandHandler(DeleteScheduleCommand)
export class DeleteScheduleService implements ICommandHandler {
  constructor(
    protected readonly logger: Logger,
    @Inject(ScheduleRepository)
    protected readonly repo: ScheduleRepositoryPort,
  ) {}
  async execute(command: DeleteScheduleCommand): Promise<AggregateID> {
    try {
      await this.repo.transaction(async () => {
        const schedule = await this.repo.findOneByTaskId(
          command.scheduledTaskId,
        );
        schedule.unload();
        schedule.delete();
        await this.repo.delete(schedule);
      });
      return command.scheduledTaskId;
    } catch (error) {
      this.logger.error(
        'DeleteScheduleService.execute encountered an error',
        error,
      );
    }
  }
}
