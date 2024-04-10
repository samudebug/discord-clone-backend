import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { IChatRepository } from './repo/IChatRepository';
import { ChatRepositoryPrisma } from './repo/ChatRepositoryPrisma';
import { ProfileModule } from 'src/profile/profile.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [ProfileModule, MessagesModule],
  providers: [
    ChatsService,
    PrismaService,
    {
      provide: IChatRepository,
      useFactory: (prisma: PrismaService) => new ChatRepositoryPrisma(prisma),
      inject: [PrismaService],
    },
  ],
  controllers: [ChatsController],
})
export class ChatsModule {}
