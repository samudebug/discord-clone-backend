import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDTO } from './dto/create-chat.dto';
import { IChatRepository } from './repo/IChatRepository';
import { ProfileService } from '../profile/profile.service';
import { MessagesService } from 'src/messages/messages.service';
import { CreateMessageRequestDTO } from 'src/messages/dto/create-message-request.dto';

@Injectable()
export class ChatsService {
  constructor(
    private repo: IChatRepository,
    private profileService: ProfileService,
    private messageService: MessagesService,
  ) {}
  createChat(createRequest: CreateChatDTO) {
    return this.repo.createChat(createRequest);
  }

  async getChat(id: string, uid: string) {
    const { id: profileId } = await this.profileService.getProfileByUid(uid);

    const result = await this.repo.getChatById(id, profileId);
    if (!result) throw new NotFoundException('This chat does not exist');
    return result;
  }

  async getChatsByProfileId(uid: string) {
    const { id: profileId } = await this.profileService.getProfileByUid(uid);
    return this.repo.getChatsByProfileId(profileId);
  }

  async createMessage(
    chatId: string,
    uid: string,
    message: CreateMessageRequestDTO,
  ) {
    const { id: profileId } = await this.profileService.getProfileByUid(uid);
    await this.getChat(chatId, uid);
    return this.messageService.createMessage(message, chatId, profileId);
  }

  async getMessages(chatId: string, uid: string) {
    await this.getChat(chatId, uid);
    return this.messageService.findMessagesByChat(chatId);
  }
}
