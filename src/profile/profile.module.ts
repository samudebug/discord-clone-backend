import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { IProfileRepository } from './repo/IProfileRepository';
import { PrismaService } from '../services/prisma/prisma.service';
import { ProfileRepositoryPrisma } from './repo/ProfileRepositoryPrisma';
import { ProfileController } from './profile.controller';

@Module({
  providers: [
    ProfileService,
    PrismaService,
    {
      provide: IProfileRepository,
      useFactory: (prisma: PrismaService) =>
        new ProfileRepositoryPrisma(prisma),
      inject: [PrismaService],
    },
  ],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
