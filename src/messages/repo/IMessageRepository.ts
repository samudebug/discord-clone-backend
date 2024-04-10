import { Message } from '@prisma/client';
import { CreateMessageDTO } from '../dto/create-message.dto';
import { PaginatedResult } from 'src/models/paginatedResult';

export abstract class IMessageRepository {
  abstract findMessagesByChat(
    chatId: string,
    page?: number,
  ): Promise<PaginatedResult<Message>>;

  abstract createMessage(request: CreateMessageDTO): Promise<Message>;
}
