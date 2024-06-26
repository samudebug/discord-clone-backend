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
    if (!result) throw new NotFoundException('This profile does not exist');
    return result;
  }

  async getProfileById(id: string) {
    const profile = await this.repo.getProfile(id);
    if (!profile) throw new NotFoundException('This profile does not exist');
    return profile;
  }

  async searchProfiles(uid: string, query?: string, page?: number) {
    const { username } = await this.getProfileByUid(uid);
    return this.repo.searchProfiles(username, query, page);
  }

  async checkUsername(username: string) {
    const available = await this.repo.checkUsername(username);
    return { available };
  }
}
