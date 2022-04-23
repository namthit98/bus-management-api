import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Please input old password' })
  oldpassword: string;

  @IsNotEmpty({ message: 'Please input new password' })
  password: string;
}
