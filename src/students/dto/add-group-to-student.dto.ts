import { IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AddGroupToStudentDto {
  @IsString()
  @ApiPropertyOptional()
  group: string;
}
