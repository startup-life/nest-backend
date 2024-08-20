import {forwardRef, Module} from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Post} from "./post.entity";
import {File} from "../file/file.entity";
import {UserModule} from "../user/user.module";
import {FileModule} from "../file/file.module";
import {User} from "../user/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, File, User]),
        FileModule,
        forwardRef(() => UserModule),
    ], // PostRepository 제공
    providers: [PostService],
    controllers: [PostController],
    exports: [PostService],
})
export class PostModule {}
