import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import {CommentService} from "./comment.service";
import {AddCommentDto} from "./dto/add-comment.dto";
import {UpdateCommentDto} from "./dto/update-comment.dto";

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get()
    async getComments(): Promise<any[]> {
        return await this.commentService.getComments();
    }

    @Get(':comment_id')
    async getComment(@Param('comment_id', ParseIntPipe) commentId: number): Promise<any> {
        return await this.commentService.getCommentById(commentId);
    }

    @Post()
    async addComment(@Body() body: AddCommentDto): Promise<any> {
        return await this.commentService.addComment(body.postId, body.commentContent);
    }

    @Put(':comment_id')
    async updateComment(
        @Param('comment_id', ParseIntPipe) commentId: number,
        @Body() body: UpdateCommentDto,
    ): Promise<any> {
        return await this.commentService.updateComment(commentId, body.commentContent);
    }

    @Delete(':comment_id')
    async deleteComment(@Param('comment_id', ParseIntPipe) commentId: number): Promise<void> {
        return await this.commentService.deleteComment(commentId);
    }
}
