import { IsOptional, IsString } from 'class-validator';

export class QueryFilterDto {
  @IsString()
  @IsOptional()
  public sortField?: string;

  @IsString()
  @IsOptional()
  public sortOrder?: string = 'DESC';
}
