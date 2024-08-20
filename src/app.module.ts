import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { PostController } from './post/post.controller';
import { CommentController } from './comment/comment.controller';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
import { CommentService } from './comment/comment.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import { FileController } from './file/file.controller';
import { AuthController } from './auth/auth.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { UploadController } from './upload/upload.controller';
import { UploadService } from './upload/upload.service';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        envFilePath: '.env.dev',
      }),
      DatabaseModule,
      ThrottlerModule.forRoot([{
          ttl: 10, // 10초 동안
          limit: 100, // 최대 100번의 요청 허용
      }]),
      UserModule,
      AuthModule,
      FileModule,
      PostModule,
      CommentModule,
      UploadModule,
  ],
  controllers: [AppController, UserController, PostController, CommentController, FileController, AuthController, UploadController],
  providers: [
      AppService,
      {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
      },
      UploadService,
  ],
})
export class AppModule {}
