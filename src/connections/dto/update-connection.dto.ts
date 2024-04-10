import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateConnectionDTO {
  @IsNotEmpty({ message: 'Status must not be empty' })
  @IsIn(['APPROVED', 'BLOCKED'], { message: 'Status is invalid' })
  status: string;
}
