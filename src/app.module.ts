import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { PostController } from './post/post.controller';
import { CommentController } from './comment/comment.controller';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
import { CommentService } from './comment/comment.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
        ThrottlerModule.forRoot([{
            ttl: 5 * 1000,
            limit: 10,
        }]),
        ConfigModule.forRoot({
            envFilePath: '.env.dev',
        }),
        DatabaseModule,
    ],
    controllers: [AppController, UserController, PostController, CommentController],
    providers: [
      AppService,
      {
          provide: APP_GUARD,
          useClass: ThrottlerGuard
      },
      UserService,
      PostService,
      CommentService
    ],
})
export class AppModule {}
