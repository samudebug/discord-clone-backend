import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { UserId } from '../decorators/userId.decorator';
import { CreateChatDTO } from './dto/create-chat.dto';
import { CreateMessageRequestDTO } from 'src/messages/dto/create-message-request.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('chats')
@UseGuards(AuthGuard)
export class ChatsController {
  constructor(private service: ChatsService) {}

  @Get('')
  getChats(@UserId() uid: string, @Query('page') page?: number) {
    return this.service.getChatsByProfileId(uid, page);
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
  getMessages(
    @Param('id') chatId: string,
    @UserId() uid: string,
    @Query('page') page?: number,
  ) {
    return this.service.getMessages(chatId, uid, page);
  }
}
