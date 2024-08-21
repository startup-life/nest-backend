import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Put, Query
} from '@nestjs/common';
import {CommentService} from "./comment.service";

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get('post/:post_id')
    async getAllComments(@Param('post_id', ParseIntPipe) postId: number): Promise<any[]> {
        if (!postId) {
            throw new BadRequestException('invalid postId');
        }

        return await this.commentService.getAllComments(postId);
    }

    @Post('post/:post_id')
    async addComment(
        @Param('post_id', ParseIntPipe) postId: number,
        @Query('userid', ParseIntPipe) userId: number,
        @Body('commentContent') commentContent: string,
    ): Promise<any> {
        if (!postId) {
            throw new BadRequestException('invalid postId');
        }

        if (!userId) {
            throw new BadRequestException('invalid userId');
        }

        if (!commentContent) {
            throw new BadRequestException('invalid commentContent');
        }

        if (commentContent.length > 1000) {
            throw new BadRequestException('commentContent is too long');
        }

        const requestBody = {
            postId,
            userId,
            commentContent,
        };

        return await this.commentService.addComment(requestBody);
    }

    @Put('post/:post_id/:comment_id')
    async updateComment(
        @Param('post_id', ParseIntPipe) postId: number,
        @Param('comment_id', ParseIntPipe) commentId: number,
        @Query('userid', ParseIntPipe) userId: number,
        @Body('commentContent') commentContent: string,
    ): Promise<any> {
        if (!postId) {
            throw new BadRequestException('invalid postId');
        }

        if (!commentId) {
            throw new BadRequestException('invalid commentId');
        }

        if (!commentContent) {
            throw new BadRequestException('invalid commentContent');
        }

        if (commentContent.length > 1000) {
            throw new BadRequestException('commentContent is too long');
        }

        const requestBody = {
            postId,
            userId,
            commentId,
            commentContent,
        };

        return await this.commentService.updateComment(requestBody);

    }

    @Delete('post/:post_id/:comment_id')
    async deleteComment(
        @Param('post_id', ParseIntPipe) postId: number,
        @Param('comment_id', ParseIntPipe) commentId: number,
        @Query('userid', ParseIntPipe) userId: number,
    ): Promise<any> {
        if (!postId) {
            throw new BadRequestException('invalid postId');
        }

        if (!commentId) {
            throw new BadRequestException('invalid commentId');
        }

        if (!userId) {
            throw new BadRequestException('invalid userId');
        }

        const requestBody = {
            postId,
            userId,
            commentId,
        };

        return await this.commentService.softDeleteComment(requestBody);
    }
}
