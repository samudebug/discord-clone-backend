import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
    const blockings = await this.getBlockings(uid, to);
    if (blockings.length > 0)
      throw new UnauthorizedException('This profile is blocked');
    return this.repo.createConnection(from, to);
  }

  async getConnections(uid: string, status?: ConnectionStatus) {
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

    await this.getById(id, uid);
    return this.repo.updateConnection(id, profileId, update);
  }

  async getBlockings(uid: string, to: string) {
    const { id: from } = await this.profileService.getProfileByUid(uid);
    await this.profileService.getProfileById(to);
    return this.repo.getBlockings(from, to);
  }
  /**
   *
   * @param id The ID of the connection
   * @param uid The ID of the User
   *
   * The Profile can only delete a Connection if it participates on the Connection.
   */
  async deleteConnection(id: string, uid: string) {
    await this.getById(id, uid);
    const { id: profileId } = await this.profileService.getProfileByUid(uid);
    return await this.repo.deleteConnection(id, profileId);
  }
}
