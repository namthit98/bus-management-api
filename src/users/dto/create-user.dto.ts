import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  fullname: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsNumber()
  phone: string;

  @IsDateString()
  @IsOptional()
  birthday: Date;

  @IsString()
  @IsOptional()
  identification: string;

  @IsString()
  role: string;
}
