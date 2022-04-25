import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FindAllCoachDto {
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
}
