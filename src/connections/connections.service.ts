import { Injectable, NotFoundException } from '@nestjs/common';
import { IConnectionRepository } from './repo/IConnectionRepository';
import { ProfileService } from 'src/profile/profile.service';
import { ConnectionStatus } from '@prisma/client';
import { UpdateConnectionDTO } from './dto/update-connection.dto';

@Injectable()
export class ConnectionsService {
  constructor(
    private repo: IConnectionRepository,
    private profileService: ProfileService,
  ) {}

  async createConnection(uid: string, to: string) {
    const { id: from } = await this.profileService.getProfileByUid(uid);
    await this.profileService.getProfileById(to);
    return this.repo.createConnection(from, to);
  }

  async getConnections(
    uid: string,
    status: ConnectionStatus = ConnectionStatus.PENDING,
  ) {
    const { id: profileId } = await this.profileService.getProfileByUid(uid);
    return this.repo.getConnections(profileId, status);
  }

  async getById(id: string, uid: string) {
    const { id: profileId } = await this.profileService.getProfileByUid(uid);

    const connection = await this.repo.getById(id, profileId);
    if (!connection)
      throw new NotFoundException('This connection does not exist');
    return connection;
  }

  async updateConnection(id: string, uid: string, update: UpdateConnectionDTO) {
    const { id: profileId } = await this.profileService.getProfileByUid(uid);

    await this.getById(id, profileId);
    return this.repo.updateConnection(id, profileId, update);
  }
}
