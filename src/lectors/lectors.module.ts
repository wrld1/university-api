import { Module } from '@nestjs/common';
import { LectorsService } from './lectors.service';
import { LectorsController } from './lectors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lector } from './entities/lector.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lector])],
  controllers: [LectorsController],
  providers: [LectorsService],
  exports: [TypeOrmModule],
})
export class LectorsModule {}
