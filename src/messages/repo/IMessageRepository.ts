import { Message } from '@prisma/client';
import { CreateMessageDTO } from '../dto/create-message.dto';

export abstract class IMessageRepository {
  abstract findMessagesByChat(chatId: string): Promise<Message[]>;

  abstract createMessage(request: CreateMessageDTO): Promise<Message>;
}
