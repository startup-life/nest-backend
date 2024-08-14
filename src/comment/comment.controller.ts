import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import {CommentService} from "./comment.service";

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get()
    async getComments() {
        const comments = await this.commentService.getComments();
        return comments;
    }

    @Get(':comment_id')
    async getComment(@Param('comment_id', ParseIntPipe) commentId: number) {
        const comment = await this.commentService.getCommentById(commentId);
        return comment;
    }

    @Post()
    async addComment(@Body() body: { postId: number; commentContent: string }) {
        const newComment = await this.commentService.addComment(body.postId, body.commentContent);
        return newComment;
    }

    @Put(':comment_id')
    async updateComment(
        @Param('comment_id', ParseIntPipe) commentId: number,
        @Body() body: { commentContent: string },
    ) {
        const updateComment = await this.commentService.updateComment(commentId, body.commentContent);
        return updateComment;
    }

    @Delete(':comment_id')
    async deleteComment(@Param('comment_id', ParseIntPipe) commentId: number) {
        await this.commentService.deleteComment(commentId);
        return null; // DELETE 요청이므로 성공 시 본문이 없음을 의미하는 null 반환
    }
}
