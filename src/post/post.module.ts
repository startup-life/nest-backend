import {Module} from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Post} from "./post.entity";
import {File} from "../file/file.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Post, File])], // PostRepository 제공
    providers: [PostService],
    controllers: [PostController],
    exports: [PostService],
})
export class PostModule {}
