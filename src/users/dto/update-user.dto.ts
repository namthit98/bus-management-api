import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  fullname: string;

  @IsEmail()
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
