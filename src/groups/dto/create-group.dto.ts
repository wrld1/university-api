import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
