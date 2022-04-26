import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  fullname: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  lineId: string;

  @IsNumber()
  numberOfTickets: number;
}
