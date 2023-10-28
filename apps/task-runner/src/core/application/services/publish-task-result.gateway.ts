import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PublishTaskResultCommand } from 'apps/task-runner/src/interface/commands/publish-task-result.command';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '',
  },
})
@CommandHandler(PublishTaskResultCommand)
export class PublishTaskResultGateway
  implements
    ICommandHandler,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect
{
  constructor(private readonly logger: Logger) {}

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  async execute(command: PublishTaskResultCommand): Promise<void> {
    try {
      this.io.emit(command.scheduledTaskId, command);
    } catch (error) {
      this.logger.error(
        'PublishTaskResultGateway.execute encountered an error',
        error,
      );
    }
  }
}
