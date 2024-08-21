import { Module } from '@nestjs/common';
import {CommentService} from "./comment.service";
import {CommentController} from "./comment.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Comment} from "./comment.entity";
import {Post} from "../post/post.entity";
import {File} from "../file/file.entity";
import {UserModule} from "../user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Comment, Post, File]),
        UserModule
    ],
    providers: [CommentService],
    controllers: [CommentController],
    exports: [CommentService],
})
export class CommentModule {}
