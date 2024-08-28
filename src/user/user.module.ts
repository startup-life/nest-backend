import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import {FileModule} from "../file/file.module";
import {PostModule} from "../post/post.module";
import {Post} from "../post/post.entity";
import {Comment} from "../comment/comment.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Post, Comment]),
        FileModule,
        forwardRef(() => PostModule), // 순환 참조 (순환 종속성, Circular Dependency)
    ],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
