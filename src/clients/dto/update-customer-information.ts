import { IsOptional, IsString } from 'class-validator';

export class UpdateCustomerInformationDto {
  @IsString()
  fullname: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  birthday: Date;
}
