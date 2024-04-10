import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma/prisma.service';
import { ProfileModule } from './profile/profile.module';
import { ConnectionsModule } from './connections/connections.module';
import { MessagesModule } from './messages/messages.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [ProfileModule, ConnectionsModule, MessagesModule, ChatsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
