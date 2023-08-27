import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { typeOrmAsyncConfig } from 'src/configs/database/typeorm-config';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmAsyncConfig)],
  providers: [AppService],
})
export class AppModule {}
