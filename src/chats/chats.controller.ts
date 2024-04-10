import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { UserId } from '../decorators/userId.decorator';
import { CreateChatDTO } from './dto/create-chat.dto';
import { CreateMessageRequestDTO } from 'src/messages/dto/create-message-request.dto';

@Controller('chats')
export class ChatsController {
  constructor(private service: ChatsService) {}

  @Get('')
  getChats(@UserId() uid: string) {
    return this.service.getChatsByProfileId(uid);
  }

  @Get(':id')
  getChatById(@Param('id') id: string, @UserId() uid: string) {
    return this.service.getChat(id, uid);
  }

  @Post('')
  createChat(@Body(ValidationPipe) createRequest: CreateChatDTO) {
    return this.service.createChat(createRequest);
  }

  @Post(':id/messages')
  sendMessage(
    @Body(ValidationPipe) createRequest: CreateMessageRequestDTO,
    @Param('id') chatId: string,
    @UserId() uid: string,
  ) {
    return this.service.createMessage(chatId, uid, createRequest);
  }

  @Get(':id/messages')
  getMessages(@Param('id') chatId: string, @UserId() uid: string) {
    return this.service.getMessages(chatId, uid);
  }
}
