import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  surname: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  age: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  imagePath: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  groupId?: number;
}
