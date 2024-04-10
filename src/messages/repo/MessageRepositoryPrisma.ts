import { PrismaService } from 'src/services/prisma/prisma.service';
import { IMessageRepository } from './IMessageRepository';
import { Message } from '@prisma/client';
import { CreateMessageDTO } from '../dto/create-message.dto';

export class MessageRepositoryPrisma implements IMessageRepository {
  constructor(private prisma: PrismaService) {}
  findMessagesByChat(chatId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
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
