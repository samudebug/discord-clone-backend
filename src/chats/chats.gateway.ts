import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Message } from '@prisma/client';
import { Server } from 'socket.io';

@WebSocketGateway()
@Injectable()
export class ChatsGateway {
  @WebSocketServer()
  server: Server;

  emitMessage(key: string, message: Message) {
    this.server.emit(key, message);
  }
}
