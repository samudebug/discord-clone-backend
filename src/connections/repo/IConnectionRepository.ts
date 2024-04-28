import { Connection, ConnectionStatus, Profile } from '@prisma/client';
import { UpdateConnectionDTO } from '../dto/update-connection.dto';
export abstract class IConnectionRepository {
  abstract createConnection(
    from: string,
    to: string,
  ): Promise<
    Connection & {
      profiles: Omit<Profile, 'connectionIds' | 'chatIds' | 'messageIds'>[];
    }
  >;
  abstract getConnections(
    profileId: string,
    status?: ConnectionStatus,
  ): Promise<
    (Connection & {
      profiles: Omit<Profile, 'connectionIds' | 'chatIds' | 'messageIds'>[];
    })[]
  >;
  abstract getById(
    id: string,
    profileId: string,
  ): Promise<
    Connection & {
      profiles: Omit<Profile, 'connectionIds' | 'chatIds' | 'messageIds'>[];
    }
  >;
  abstract updateConnection(
    id: string,
    profileId: string,
    update: UpdateConnectionDTO,
  ): Promise<
    Connection & {
      profiles: Omit<Profile, 'connectionIds' | 'chatIds' | 'messageIds'>[];
    }
  >;
  abstract getBlockings(from: string, to: string): Promise<Connection[]>;

  /**
   *
   * @param id The ID of the connection
   * @param profileId The ID of the Profile who created the Connection
   *
   *
   * The Profile can only delete a Connection if it participates on the Connection.
   */
  abstract deleteConnection(id: string, profileId: string): Promise<void>;
}
