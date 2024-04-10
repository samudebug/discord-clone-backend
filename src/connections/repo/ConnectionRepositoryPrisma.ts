import { PrismaService } from 'src/services/prisma/prisma.service';
import { IConnectionRepository } from './IConnectionRepository';
import { Connection, ConnectionStatus } from '@prisma/client';
import { UpdateConnectionDTO } from '../dto/update-connection.dto';

export class ConnectionRepositoryPrisma implements IConnectionRepository {
  constructor(private prisma: PrismaService) {}
  createConnection(from: string, to: string): Promise<Connection> {
    return this.prisma.connection.create({
      data: {
        profileIds: [from, to],
      },
    });
  }
  getConnections(
    profileId: string,
    status: ConnectionStatus,
  ): Promise<Connection[]> {
    return this.prisma.connection.findMany({
      where: {
        profileIds: {
          hasSome: [profileId],
        },
        status,
      },
    });
  }

  getById(id: string, profileId: string): Promise<Connection> {
    return this.prisma.connection.findFirst({
      where: { id, profileIds: { hasSome: [profileId] } },
    });
  }

  updateConnection(
    id: string,
    profileId: string,
    update: UpdateConnectionDTO,
  ): Promise<Connection> {
    return this.prisma.connection.update({
      where: {
        id,
        profileIds: {
          hasSome: [profileId],
        },
      },
      data: {
        status:
          update.status === 'APPROVED'
            ? ConnectionStatus.APPROVED
            : ConnectionStatus.PENDING,
      },
    });
  }
}
