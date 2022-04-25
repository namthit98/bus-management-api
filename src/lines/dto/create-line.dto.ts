import { IsString } from 'class-validator';
export class CreateLineDto {
  @IsString()
  startTime: Date;

  @IsString()
  endTime: Date;

  @IsString()
  route: string;

  @IsString()
  coach: string;
}
