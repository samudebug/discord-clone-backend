import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { IMessageRepository } from './repo/IMessageRepository';
import { MessageRepositoryPrisma } from './repo/MessageRepositoryPrisma';

@Module({
  providers: [
    MessagesService,
    PrismaService,
    {
      provide: IMessageRepository,
      useFactory: (prisma: PrismaService) =>
        new MessageRepositoryPrisma(prisma),
      inject: [PrismaService],
    },
  ],
  exports: [MessagesService],
})
export class MessagesModule {}
