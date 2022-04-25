import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FindAllLineDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  pageSize: number;

  @IsString()
  @IsOptional()
  searchText: string;

  @IsString()
  @IsOptional()
  startingPoint: string;

  @IsString()
  @IsOptional()
  destination: string;

  @IsString()
  @IsOptional()
  startTime: string;

  @IsString()
  @IsOptional()
  endTime: string;
}
