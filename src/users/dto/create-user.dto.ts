import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  fullname: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  phone: string;

  @IsDate()
  @IsOptional()
  birthday: Date;

  @IsString()
  @IsOptional()
  identification: string;

  @IsString()
  role: string;
}
