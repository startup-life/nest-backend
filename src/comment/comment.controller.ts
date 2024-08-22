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
import {AddCommentDto} from "./dto/add-comment.dto";
import {UpdateCommentDto} from "./dto/update-comment.dto";

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
        @Query('nickname') nickname: string,
        @Body() addCommentDto: AddCommentDto,
    ): Promise<any> {
        if (!postId) {
            throw new BadRequestException('invalid postId');
        }

        if (!userId) {
            throw new BadRequestException('invalid userId');
        }

        if (!nickname) {
            throw new BadRequestException('invalid nickname');
        }

        return await this.commentService.addComment(postId, userId, nickname, addCommentDto);
    }

    @Put('post/:post_id/:comment_id')
    async updateComment(
        @Param('post_id', ParseIntPipe) postId: number,
        @Param('comment_id', ParseIntPipe) commentId: number,
        @Query('userid', ParseIntPipe) userId: number,
        @Query('nickname') nickname: string,
        @Body() updateCommentDto: UpdateCommentDto,
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

        if (!nickname) {
            throw new BadRequestException('invalid nickname');
        }

        return await this.commentService.updateComment(postId, commentId, userId, nickname, updateCommentDto);

    }

    @Delete('post/:post_id/:comment_id')
    async softDeleteComment(
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

        return await this.commentService.softDeleteComment(postId, userId, commentId);
    }
}
