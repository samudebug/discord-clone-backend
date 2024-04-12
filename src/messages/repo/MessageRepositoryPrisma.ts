import { PrismaService } from 'src/services/prisma/prisma.service';
import { IMessageRepository } from './IMessageRepository';
import { Message, Profile } from '@prisma/client';
import { CreateMessageDTO } from '../dto/create-message.dto';
import { PaginatedResult } from 'src/models/paginatedResult';

export class MessageRepositoryPrisma implements IMessageRepository {
  constructor(private prisma: PrismaService) {}
  async findMessagesByChat(
    chatId: string,
    page = 1,
  ): Promise<
    PaginatedResult<Omit<Message, 'chatId' | 'senderId'> & { sender: Profile }>
  > {
    const total = await this.prisma.message.count({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const results = await this.prisma.message.findMany({
      where: {
        chatId,
      },
      select: {
        sender: true,
        id: true,
        content: true,
        attachment: true,
        attachmentUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
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

  createMessage({
    content,
    attachment,
    chatId,
    senderId,
    attachmentUrl,
  }: CreateMessageDTO): Promise<Message & { sender: Profile }> {
    return this.prisma.message.create({
      data: {
        content,
        attachment,
        attachmentUrl,
        chatId,
        senderId,
      },
      include: {
        sender: true,
      },
    });
  }
}
