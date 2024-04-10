import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserId } from '../decorators/userId.decorator';
import { AuthGuard } from '../guards/auth/auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDTO } from './dto/update-profile-dto';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private service: ProfileService) {}
  @Get('me')
  async getProfileByUid(@UserId() uid: string) {
    return this.service.getProfileByUid(uid);
  }

  @Patch('me')
  async upserUser(
    @UserId() uid: string,
    @Body(ValidationPipe) profile: UpdateProfileDTO,
  ) {
    return this.service.upsertUser(uid, profile);
  }

  @Get('')
  async searchProfiles(
    @UserId() uid: string,
    @Query('search') query?: string,
    @Query('page') page?: number,
  ) {
    return this.service.searchProfiles(uid, query, page);
  }
}
