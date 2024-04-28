import { PrismaService } from 'src/services/prisma/prisma.service';
import { IConnectionRepository } from './IConnectionRepository';
import { Connection, ConnectionStatus, Profile } from '@prisma/client';
import { UpdateConnectionDTO } from '../dto/update-connection.dto';

export class ConnectionRepositoryPrisma implements IConnectionRepository {
  constructor(private prisma: PrismaService) {}
  createConnection(
    from: string,
    to: string,
  ): Promise<
    Connection & {
      profiles: Omit<Profile, 'connectionIds' | 'chatIds' | 'messageIds'>[];
    }
  > {
    return this.prisma.connection.create({
      data: {
        profileIds: [from, to],
        from,
      },
      include: {
        profiles: {
          select: {
            id: true,
            uid: true,
            username: true,
            displayName: true,
            photoUrl: true,
            completedOnboarding: true,
          },
        },
      },
    });
  }
  getConnections(
    profileId: string,
    status?: ConnectionStatus,
  ): Promise<
    (Connection & {
      profiles: Omit<Profile, 'connectionIds' | 'chatIds' | 'messageIds'>[];
    })[]
  > {
    return this.prisma.connection.findMany({
      where: {
        profileIds: {
          hasSome: [profileId],
        },
        OR: [
          ...(status != null ? [{ status }] : []),
          {
            status: ConnectionStatus.PENDING,
          },
        ],
      },
      include: {
        profiles: {
          where: {
            NOT: {
              id: profileId,
            },
          },
          select: {
            id: true,
            uid: true,
            username: true,
            displayName: true,
            photoUrl: true,
            completedOnboarding: true,
          },
        },
      },
    });
  }

  getById(
    id: string,
    profileId: string,
  ): Promise<
    Connection & {
      profiles: Omit<Profile, 'connectionIds' | 'chatIds' | 'messageIds'>[];
    }
  > {
    return this.prisma.connection.findFirst({
      where: { id, profileIds: { hasSome: [profileId] } },
      include: {
        profiles: {
          select: {
            id: true,
            uid: true,
            username: true,
            displayName: true,
            photoUrl: true,
            completedOnboarding: true,
          },
        },
      },
    });
  }

  updateConnection(
    id: string,
    profileId: string,
    update: UpdateConnectionDTO,
  ): Promise<
    Connection & {
      profiles: Omit<Profile, 'connectionIds' | 'chatIds' | 'messageIds'>[];
    }
  > {
    return this.prisma.connection.update({
      where: {
        id,
        profileIds: {
          hasSome: [profileId],
        },
      },
      data: {
        status: ConnectionStatus[update.status],
      },
      include: {
        profiles: {
          select: {
            id: true,
            uid: true,
            username: true,
            displayName: true,
            photoUrl: true,
            completedOnboarding: true,
          },
        },
      },
    });
  }

  getBlockings(from: string, to: string): Promise<Connection[]> {
    return this.prisma.connection.findMany({
      where: {
        profileIds: {
          equals: [to, from],
        },
        status: ConnectionStatus.BLOCKED,
      },
    });
  }

  async deleteConnection(id: string, profileId: string): Promise<void> {
    await this.prisma.connection.delete({
      where: {
        id,
        profileIds: {
          has: profileId,
        },
      },
    });
  }
}
