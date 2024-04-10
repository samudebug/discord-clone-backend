import { Profile } from '@prisma/client';
import { UpdateProfileDTO } from '../dto/update-profile-dto';
import { IProfileRepository } from './IProfileRepository';
import { PrismaService } from '../../services/prisma/prisma.service';

export class ProfileRepositoryPrisma implements IProfileRepository {
  constructor(private prisma: PrismaService) {}
  upsertProfile(uid: string, profile: UpdateProfileDTO): Promise<Profile> {
    return this.prisma.profile.upsert({
      where: {
        uid,
      },
      update: profile,
      create: profile,
    });
  }

  getProfileByUid(uid: string): Promise<Profile> {
    return this.prisma.profile.findFirst({
      where: {
        uid,
      },
    });
  }
}
