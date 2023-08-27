import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMarkDto {
  @IsInt()
  @Min(0)
  @Max(12)
  @IsNotEmpty()
  @ApiProperty()
  mark: string;

  @IsNotEmpty()
  @ApiProperty()
  course: string;

  @IsNotEmpty()
  @ApiProperty()
  student: string;

  @IsNotEmpty()
  @ApiProperty()
  lector: string;
}
