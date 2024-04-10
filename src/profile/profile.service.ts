import { Injectable, NotFoundException } from '@nestjs/common';
import { IProfileRepository } from './repo/IProfileRepository';
import { UpdateProfileDTO } from './dto/update-profile-dto';
import * as admin from 'firebase-admin';

@Injectable()
export class ProfileService {
  constructor(private repo: IProfileRepository) {}

  async upsertUser(uid: string, profile: UpdateProfileDTO) {
    const profileUpdate: { displayName?: string; photoURL?: string } = {
      displayName: profile.displayName,
      ...(profile.photoUrl && { photoURL: profile.photoUrl }),
    };
    await admin.auth().updateUser(uid, profileUpdate);
    return this.repo.upsertProfile(uid, profile);
  }

  async getProfileByUid(uid: string) {
    const result = this.repo.getProfileByUid(uid);
    if (!result) throw new NotFoundException('Profile does not exist');
    return result;
  }
}
