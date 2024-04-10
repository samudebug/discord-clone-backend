import { Chat } from '@prisma/client';
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
  getChatById(id: string, profileId: string): Promise<Chat> {
    return this.prisma.chat.findFirst({
      where: {
        id,
        memberIds: {
          has: profileId,
        },
      },
    });
  }
  async getChatsByProfileId(
    profileId: string,
    page = 1,
  ): Promise<PaginatedResult<Chat>> {
    const total = await this.prisma.chat.count({
      where: {
        memberIds: {
          has: profileId,
        },
      },
    });
    const results = await this.prisma.chat.findMany({
      where: {
        memberIds: {
          has: profileId,
        },
      },
      take: 30,
      skip: (page - 1) * 30,
    });
    return {
      page,
      results,
      total,
    };
  }
}
