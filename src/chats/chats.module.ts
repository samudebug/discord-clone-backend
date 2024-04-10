import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { IChatRepository } from './repo/IChatRepository';
import { ChatRepositoryPrisma } from './repo/ChatRepositoryPrisma';
import { ProfileModule } from 'src/profile/profile.module';
import { MessagesModule } from 'src/messages/messages.module';
import { ChatsGateway } from './chats.gateway';

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
    ChatsGateway,
  ],
  controllers: [ChatsController],
})
export class ChatsModule {}
