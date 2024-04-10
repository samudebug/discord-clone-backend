import { IsNotEmpty, IsUrl, MaxLength, ValidateIf } from 'class-validator';

export class CreateMessageRequestDTO {
  @MaxLength(256, { message: 'Content must not have more than 256 characters' })
  content: string;

  @ValidateIf((o) => o.content.length === 0, {
    message: 'Attachment URL cannot be empty if content is empty',
  })
  @IsUrl({}, { message: 'Attachment URL must be an URL' })
  @IsNotEmpty({ message: 'Attachment URL cannot be empty' })
  attachmentUrl?: string;
}
