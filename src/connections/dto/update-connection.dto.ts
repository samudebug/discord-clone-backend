import { Equals, IsNotEmpty } from 'class-validator';

export class UpdateConnectionDTO {
  @IsNotEmpty({ message: 'Status must not be empty' })
  @Equals('APPROVED', { message: 'Status is invalid' })
  status: string;
}
