import { Profile } from '@prisma/client';
import { UpdateProfileDTO } from '../dto/update-profile-dto';

export abstract class IProfileRepository {
  abstract upsertProfile(
    uid: string,
    profile: UpdateProfileDTO,
  ): Promise<Profile>;

  abstract getProfileByUid(uid: string): Promise<Profile>;

  abstract getProfile(id: string): Promise<Profile>;

  abstract searchProfiles(username: string, query: string): Promise<Profile[]>;
}
