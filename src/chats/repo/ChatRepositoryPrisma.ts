import { Chat } from '@prisma/client';
import { CreateChatDTO } from '../dto/create-chat.dto';
import { IChatRepository } from './IChatRepository';
import { PrismaService } from 'src/services/prisma/prisma.service';

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
  getChatsByProfileId(profileId: string): Promise<Chat[]> {
    return this.prisma.chat.findMany({
      where: {
        memberIds: {
          has: profileId,
        },
      },
    });
  }
}
