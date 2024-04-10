import { PrismaService } from 'src/services/prisma/prisma.service';
import { IMessageRepository } from './IMessageRepository';
import { Message } from '@prisma/client';
import { CreateMessageDTO } from '../dto/create-message.dto';
import { PaginatedResult } from 'src/models/paginatedResult';

export class MessageRepositoryPrisma implements IMessageRepository {
  constructor(private prisma: PrismaService) {}
  async findMessagesByChat(
    chatId: string,
    page = 1,
  ): Promise<PaginatedResult<Message>> {
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
  }: CreateMessageDTO): Promise<Message> {
    return this.prisma.message.create({
      data: {
        content,
        attachment,
        attachmentUrl,
        chatId,
        senderId,
      },
    });
  }
}
