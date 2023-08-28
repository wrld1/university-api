import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { typeOrmAsyncConfig } from 'src/configs/database/typeorm-config';
import { StudentsModule } from 'src/students/students.module';
import { GroupsModule } from 'src/groups/groups.module';
import { CoursesModule } from 'src/courses/courses.module';
import { LectorsModule } from 'src/lectors/lectors.module';
import { PostsModule } from 'src/posts/posts.module';
import { MarksModule } from 'src/marks/marks.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    StudentsModule,
    GroupsModule,
    CoursesModule,
    LectorsModule,
    PostsModule,
    MarksModule,
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
