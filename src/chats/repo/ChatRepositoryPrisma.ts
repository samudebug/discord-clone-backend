import { Chat, Message, Profile } from '@prisma/client';
import { CreateChatDTO } from '../dto/create-chat.dto';
import { IChatRepository } from './IChatRepository';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { PaginatedResult } from 'src/models/paginatedResult';

export class ChatRepositoryPrisma implements IChatRepository {
  constructor(private prisma: PrismaService) {}
  createChat(createRequest: CreateChatDTO): Promise<Chat> {
    return this.prisma.chat.create({
      data: createRequest,
    });
  }
  getChatById(
    id: string,
    profileId: string,
  ): Promise<
    Omit<Chat, 'memberIds' | 'messageIds'> & {
      members: Omit<Profile, 'connectionIds' | 'chatIds' | 'messageIds'>[];
    }
  > {
    return this.prisma.chat.findFirst({
      where: {
        id,
        memberIds: {
          has: profileId,
        },
      },
      select: {
        id: true,
        members: {
          where: {
            NOT: {
              id: profileId,
            },
          },
          select: {
            id: true,
            uid: true,
            username: true,
            displayName: true,
            photoUrl: true,
            completedOnboarding: true,
          },
        },
      },
    });
  }
  async getChatsByProfileId(
    profileId: string,
    page = 1,
    chatWith?: string,
  ): Promise<
    PaginatedResult<
      Omit<Chat, 'memberIds' | 'messageIds'> & {
        members: Omit<Profile, 'connectionIds' | 'chatIds' | 'messageIds'>[];
        messages: Message[];
      }
    >
  > {
    const query = [profileId];
    if (chatWith) {
      query.push(chatWith);
    }
    const total = await this.prisma.chat.count({
      where: {
        memberIds: {
          hasSome: query,
        },
      },
    });
    const results = await this.prisma.chat.findMany({
      where: {
        memberIds: {
          hasSome: query,
        },
      },
      select: {
        id: true,
        members: {
          where: {
            NOT: {
              id: profileId,
            },
          },
          select: {
            id: true,
            uid: true,
            username: true,
            displayName: true,
            photoUrl: true,
            completedOnboarding: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      take: 30,
      skip: (page - 1) * 30,
    });
    return {
      page: parseInt(page as unknown as string, 10),
      results,
      total,
    };
  }
}
