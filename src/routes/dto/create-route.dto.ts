import { IsNumber, IsString } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  startingPoint: string;

  @IsString()
  destination: string;

  @IsNumber()
  price: number;

  @IsNumber()
  timeShift: number;

  @IsNumber()
  distance: number;
}
