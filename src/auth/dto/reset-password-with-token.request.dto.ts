import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordWithTokenRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  newPassword: string;
}
