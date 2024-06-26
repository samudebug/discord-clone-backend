import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { UserId } from 'src/decorators/userId.decorator';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ConnectionStatus } from '@prisma/client';
import { CreateConnectionDTO } from './dto/create-connection.dto';
import { UpdateConnectionDTO } from './dto/update-connection.dto';

@Controller('connections')
@UseGuards(AuthGuard)
export class ConnectionsController {
  constructor(private service: ConnectionsService) {}
  @Get('')
  getConnections(
    @UserId() uid: string,
    @Query('status') status?: ConnectionStatus,
  ) {
    let connectionStatus: ConnectionStatus;
    if (status) {
      connectionStatus = ConnectionStatus[status];
    }
    return this.service.getConnections(uid, connectionStatus);
  }

  @Post('')
  createConnections(
    @UserId() uid: string,
    @Body(ValidationPipe) { to }: CreateConnectionDTO,
  ) {
    return this.service.createConnection(uid, to);
  }

  @Patch(':id')
  updateConnection(
    @UserId() uid: string,
    @Body(ValidationPipe) update: UpdateConnectionDTO,
    @Param('id') id: string,
  ) {
    return this.service.updateConnection(id, uid, update);
  }

  @Delete(':id')
  deleteConnection(@UserId() uid: string, @Param('id') id: string) {
    return this.service.deleteConnection(id, uid);
  }
}
