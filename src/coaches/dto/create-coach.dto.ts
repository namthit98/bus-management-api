import { IsString, IsNumber } from 'class-validator';

export class CreateCoachDto {
  @IsString()
  name: string;

  @IsString()
  licensePlates: string;

  @IsNumber()
  seats: number;

  @IsString()
  type: string;

  @IsString()
  route: string;

  @IsString()
  driver: string;
}
