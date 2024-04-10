import { IsNotEmpty } from 'class-validator';

export class CreateChatDTO {
  @IsNotEmpty({ each: true })
  memberIds: string[];
}
