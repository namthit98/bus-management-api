import { IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  phone: string;

  @IsString()
  fullname: string;

  @IsString()
  lineId: string;
}
