import { ConnectionStatus, Profile } from '@prisma/client';
import { UpdateProfileDTO } from '../dto/update-profile-dto';
import { PaginatedResult } from 'src/models/paginatedResult';

export abstract class IProfileRepository {
  abstract upsertProfile(
    uid: string,
    profile: UpdateProfileDTO,
  ): Promise<Profile>;

  abstract getProfileByUid(uid: string): Promise<Profile>;

  abstract getProfile(id: string): Promise<Profile>;

  abstract searchProfiles(
    username: string,
    query?: string,
    page?: number,
  ): Promise<
    PaginatedResult<Profile & { connections: { status: ConnectionStatus }[] }>
  >;

  abstract checkUsername(username: string): Promise<boolean>;
}
