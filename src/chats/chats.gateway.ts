import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Message } from '@prisma/client';
import { auth } from 'firebase-admin';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';

@WebSocketGateway({ cors: true })
@Injectable()
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => ChatsService))
    private chatService: ChatsService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: any) {
    Logger.log('Connection received', 'ChatsGateway');
    const token = client.handshake.headers.authorization;
    const isAuthorized = await this.checkToken(token);
    !isAuthorized && client.disconnect();
  }

  handleDisconnect() {
    Logger.log('Disconnected', 'ChatsGateway');
  }

  @SubscribeMessage('joinChat')
  async onJoinChat(
    @MessageBody() { chatId }: { chatId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<{ success: boolean; status: string }>> {
    const { uid } = await this.checkToken(
      client.handshake.headers.authorization,
    );
    try {
      const hasChat = await this.chatService.getChat(chatId, uid);
      if (!hasChat) {
        Logger.debug(`Does not have chat`);
        return {
          event: 'unauthorized',
          data: { success: false, status: 'Not authorized to join chat' },
        };
      }
      client.join(`chat:${chatId}`);
      Logger.debug(`Joined chat ${chatId}`);
      return {
        event: 'success',
        data: {
          success: true,
          status: 'Joined chat succesfully',
        },
      };
    } catch (error) {
      return {
        event: 'unauthorized',
        data: { success: false, status: 'Not authorized to join chat' },
      };
    }
  }

  emitMessage(chatId: string, key: string, message: Message) {
    this.server.to(`chat:${chatId}`).emit(key, message);
  }

  private async checkToken(token: string) {
    const decodedToken = await auth().verifyIdToken(token);

    if (decodedToken) {
      Logger.debug('Token authenticated', 'ChatsGateway');
    }
    return decodedToken;
  }
}
