import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { typeOrmAsyncConfig } from 'src/configs/database/typeorm-config';
import { StudentsModule } from 'src/students/students.module';
import { GroupsModule } from 'src/groups/groups.module';
import { CoursesModule } from 'src/courses/courses.module';
import { ConfigModule } from '../configs/config.module';
import { LectorsModule } from 'src/lectors/lectors.module';
import { PostsModule } from 'src/posts/posts.module';
import { MarksModule } from 'src/marks/marks.module';
import { AuthControllerModule } from 'src/auth/auth.controller.module';
import { AuthModule } from 'src/auth/auth.module';
import { ResetTokenModule } from 'src/reset-token/reset-token.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ConfigModule,
    StudentsModule,
    GroupsModule,
    CoursesModule,
    LectorsModule,
    PostsModule,
    MarksModule,
    AuthControllerModule,
    AuthModule,
    ResetTokenModule,
  ],
  providers: [AppService],
})
export class AppModule {}
