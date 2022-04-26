import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
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

  @IsString()
  @IsOptional()
  birthday: Date;

  @IsString()
  @IsOptional()
  identification: string;
}
