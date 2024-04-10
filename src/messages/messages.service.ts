import { Injectable } from '@nestjs/common';
import { IMessageRepository } from './repo/IMessageRepository';
import { CreateMessageDTO } from './dto/create-message.dto';
import { CreateMessageRequestDTO } from './dto/create-message-request.dto';
import axios from 'axios';
import { Attachment, AttachmentType } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private repo: IMessageRepository) {}

  async findMessagesByChat(chatId: string) {
    return await this.repo.findMessagesByChat(chatId);
  }

  async createMessage(
    request: CreateMessageRequestDTO,
    chatId: string,
    senderId: string,
  ) {
    let urlOnContent: string;
    if (request.content.length > 0) {
      urlOnContent = this.getUrl(request.content);
    }
    const createRequest: CreateMessageDTO = {
      content: request.content,
      chatId,
      senderId,
      attachmentUrl: request.attachmentUrl ?? urlOnContent,
    };
    if (createRequest.attachmentUrl) {
      createRequest.attachment = await this.mapAttachment(
        createRequest.attachmentUrl,
      );
    }
    return await this.repo.createMessage(createRequest);
  }

  private async mapAttachment(url: string) {
    const info = await axios.head(url);
    const contentType = info.headers['content-type'].toString();
    const isImage = contentType.startsWith('image');
    const isVideo = contentType.startsWith('video');
    const isUrl = contentType.startsWith('text/html');
    const isFile = !isImage && !isVideo && !isUrl;
    if (isImage)
      return { attachmentType: AttachmentType.IMAGE, url } as Attachment;
    if (isVideo)
      return { attachmentType: AttachmentType.VIDEO, url } as Attachment;
    if (isFile) {
      const filename = info.headers['content-disposition']
        .split('filename=')[1]
        .split('.')[0];
      const extension = info.headers['content-disposition']
        .split('.')[1]
        .split(';')[0];
      const fileName = `${filename}.${extension}`;
      return {
        attachmentType: AttachmentType.FILE,
        url,
        fileName,
      } as Attachment;
    }
    if (isUrl) {
      return {
        attachmentType: AttachmentType.URL,
        title: 'Title',
        subtitle: 'subtitle',
        contentUrl: url,
        url,
      } as Attachment;
    }
  }

  private getUrl(content: string) {
    const matches = new RegExp(
      '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?',
    ).exec(content);
    if (matches && matches.length > 0) return matches[0];
  }
}
