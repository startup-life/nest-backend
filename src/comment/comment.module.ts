import { Module } from '@nestjs/common';
import {CommentService} from "./comment.service";
import {CommentController} from "./comment.controller";

@Module({
    imports: [],
    providers: [CommentService],
    controllers: [CommentController],
    exports: [CommentService],
})
export class CommentModule {}
