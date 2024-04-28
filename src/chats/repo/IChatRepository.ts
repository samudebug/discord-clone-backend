import { Chat, Message, Profile } from '@prisma/client';
import { CreateChatDTO } from '../dto/create-chat.dto';
import { PaginatedResult } from 'src/models/paginatedResult';

export abstract class IChatRepository {
  abstract createChat(createRequest: CreateChatDTO): Promise<Chat>;

  abstract getChatById(
    id: string,
    profileId: string,
  ): Promise<
    Omit<Chat, 'memberIds' | 'messageIds'> & {
      members: Omit<Profile, 'connectionIds' | 'chatIds' | 'messageIds'>[];
    }
  >;

  abstract getChatsByProfileId(
    profileId: string,
    page?: number,
    chatWith?: string,
  ): Promise<
    PaginatedResult<
      Omit<Chat, 'memberIds' | 'messageIds'> & {
        members: Omit<Profile, 'connectionIds' | 'chatIds' | 'messageIds'>[];
        messages: Message[];
      }
    >
  >;
}
