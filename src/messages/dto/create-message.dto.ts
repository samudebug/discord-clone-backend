import { Attachment } from '@prisma/client';

export class CreateMessageDTO {
  content: string;

  attachmentUrl?: string;

  attachment?: Attachment;

  chatId: string;
  senderId: string;
}
