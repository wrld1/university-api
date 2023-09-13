import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
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
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: `${process.env.MAILER_HOST}`,
          port: 2525,
          auth: {
            user: `${process.env.MAILER__USER}`,
            pass: `${process.env.MAILER__PASSWORD}`,
          },
        },
        defaults: {
          from: 'your.email@gmail.com',
        },
      }),
    }),
    MailModule,
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
  providers: [],
})
export class AppModule {}
