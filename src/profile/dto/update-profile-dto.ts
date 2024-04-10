import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class UpdateProfileDTO {
  @IsNotEmpty({ message: 'UID must not be empty' })
  uid: string;

  @IsNotEmpty({ message: 'Username cannot be empty' })
  @MinLength(2, { message: 'Username must have at least 2 characters' })
  @MaxLength(32, { message: 'Username cannot have more than 32 characters' })
  @Transform(({ value }) => value.toLowerCase())
  @Matches(new RegExp(/^(?!.*?\.{2,})[a-z0-9_\.]{2,32}$/, 'g'), {
    message:
      'Username is invalid. Username may only include a-z, 0-9, . (dot) and _ (underscore)',
  })
  username: string;

  @IsNotEmpty({ message: 'Display Name cannot be empty' })
  @MinLength(2, { message: 'Display Name must have at least 2 characters' })
  @MaxLength(32, {
    message: 'Display Name cannot have more than 32 characters',
  })
  displayName: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsBoolean()
  completedOnboarding?: boolean = false;
}
