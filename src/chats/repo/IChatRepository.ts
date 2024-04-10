import { Chat } from '@prisma/client';
import { CreateChatDTO } from '../dto/create-chat.dto';
import { PaginatedResult } from 'src/models/paginatedResult';

export abstract class IChatRepository {
  abstract createChat(createRequest: CreateChatDTO): Promise<Chat>;

  abstract getChatById(id: string, profileId: string): Promise<Chat>;

  abstract getChatsByProfileId(
    profileId: string,
    page?: number,
  ): Promise<PaginatedResult<Chat>>;
}
