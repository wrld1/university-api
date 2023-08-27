import { IsNumberString, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { AppEnvs } from '../../application/enums';

export class ConfigDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(AppEnvs)
  APP_ENV: AppEnvs;

  @IsNotEmpty()
  @IsNumberString()
  APP_PORT: number;

  @IsNotEmpty()
  @IsNumberString()
  DATABASE_PORT: number;

  @IsNotEmpty()
  @IsString()
  DATABASE_HOST: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_USER: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_NAME: string;
}
