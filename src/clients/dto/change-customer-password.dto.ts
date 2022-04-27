import { IsNotEmpty } from 'class-validator';

export class ChangeCustomerPasswordDto {
  @IsNotEmpty({ message: 'Please input old password' })
  password: string;

  @IsNotEmpty({ message: 'Please input new password' })
  newpassword: string;
}
