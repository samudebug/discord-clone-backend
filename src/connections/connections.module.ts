import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionsController } from './connections.controller';
import { ProfileModule } from '../profile/profile.module';
import { PrismaService } from '../services/prisma/prisma.service';
import { IConnectionRepository } from './repo/IConnectionRepository';
import { ConnectionRepositoryPrisma } from './repo/ConnectionRepositoryPrisma';

@Module({
  providers: [
    ConnectionsService,
    PrismaService,
    {
      provide: IConnectionRepository,
      useFactory: (prisma: PrismaService) =>
        new ConnectionRepositoryPrisma(prisma),
      inject: [PrismaService],
    },
  ],
  controllers: [ConnectionsController],
  imports: [ProfileModule],
})
export class ConnectionsModule {}
