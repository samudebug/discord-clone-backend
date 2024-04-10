import { IsNotEmpty } from 'class-validator';

export class CreateConnectionDTO {
  @IsNotEmpty({ message: 'Receiver must not be empty' })
  to: string;
}
