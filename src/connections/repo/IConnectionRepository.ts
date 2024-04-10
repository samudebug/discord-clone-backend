import { Connection, ConnectionStatus } from '@prisma/client';
import { UpdateConnectionDTO } from '../dto/update-connection.dto';
export abstract class IConnectionRepository {
  abstract createConnection(from: string, to: string): Promise<Connection>;
  abstract getConnections(
    profileId: string,
    status: ConnectionStatus,
  ): Promise<Connection[]>;
  abstract getById(id: string, profileId: string): Promise<Connection>;
  abstract updateConnection(
    id: string,
    profileId: string,
    update: UpdateConnectionDTO,
  ): Promise<Connection>;
}
