import { Body, Controller, Delete, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AggregateID } from 'libs/ddd/entity.base';
import { DeleteUserRequestDto } from '../../dtos/user/delete-user.request.dto';
import { DeleteUserCommand } from '../../commands/user/delete-user.command';

@Controller('v1')
export class DeleteUserController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @Delete('user')
  async delete(@Body() body: DeleteUserRequestDto): Promise<AggregateID> {
    try {
      const command = DeleteUserCommand.create(body);
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'DeleteUserController.delete encountered an error',
        error,
      );
    }
  }
}
