import { Profile } from '@prisma/client';
import { UpdateProfileDTO } from '../dto/update-profile-dto';
import { IProfileRepository } from './IProfileRepository';
import { PrismaService } from '../../services/prisma/prisma.service';
import { PaginatedResult } from 'src/models/paginatedResult';

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

  getProfile(id: string): Promise<Profile> {
    return this.prisma.profile.findFirst({ where: { id } });
  }

  async searchProfiles(
    username: string,
    query?: string,
    page = 1,
  ): Promise<PaginatedResult<Profile>> {
    if ((query?.length ?? 0) > 0) {
      const total = await this.prisma.profile.count({
        where: {
          AND: [
            {
              username: {
                startsWith: query,
              },
            },
            {
              NOT: {
                username: {
                  startsWith: username,
                },
              },
            },
          ],
        },
      });
      const results = await this.prisma.profile.findMany({
        where: {
          AND: [
            {
              username: {
                startsWith: query,
              },
            },
            {
              NOT: {
                username: {
                  startsWith: username,
                },
              },
            },
          ],
        },
        take: 30,
        skip: (page - 1) * 30,
      });
      return {
        page,
        total,
        results,
      };
    }
    return {
      page: 1,
      total: 0,
      results: [],
    };
  }

  async checkUsername(username: string): Promise<boolean> {
    const total = await this.prisma.profile.count({
      where: {
        username,
      },
    });
    return total == 0;
  }
}
