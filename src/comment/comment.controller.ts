import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
    Request, HttpCode,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentDto } from './dto/add-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get('post/:post_id')
    @UseGuards(AuthGuard('jwt'))
    async getAllComments(
        @Param('post_id', ParseIntPipe) postId: number,
    ): Promise<any[]> {
        if (!postId) throw new BadRequestException('invalid postId');

        return await this.commentService.getAllComments(postId);
    }

    @Post('post/:post_id')
    @UseGuards(AuthGuard('jwt'))
    async addComment(
        @Request() request: any,
        @Param('post_id', ParseIntPipe) postId: number,
        @Body() addCommentDto: AddCommentDto,
    ): Promise<any> {
        const { userId, nickname } = request.user;
        if (!postId) throw new BadRequestException('invalid postId');

        return await this.commentService.addComment(
            postId,
            userId,
            nickname,
            addCommentDto,
        );
    }

    @Put('post/:post_id/:comment_id')
    @UseGuards(AuthGuard('jwt'))
    async updateComment(
        @Request() request: any,
        @Param('post_id', ParseIntPipe) postId: number,
        @Param('comment_id', ParseIntPipe) commentId: number,
        @Body() updateCommentDto: UpdateCommentDto,
    ): Promise<any> {
        const { userId, nickname } = request.user;
        if (!postId) throw new BadRequestException('invalid postId');
        if (!commentId) throw new BadRequestException('invalid commentId');

        return await this.commentService.updateComment(
            postId,
            commentId,
            userId,
            nickname,
            updateCommentDto,
        );
    }

    @Delete('post/:post_id/:comment_id')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(204)
    async softDeleteComment(
        @Request() request: any,
        @Param('post_id', ParseIntPipe) postId: number,
        @Param('comment_id', ParseIntPipe) commentId: number,
    ): Promise<any> {
        const { userId } = request.user;
        if (!postId) throw new BadRequestException('invalid postId');
        if (!commentId) throw new BadRequestException('invalid commentId');

        return await this.commentService.softDeleteComment(
            postId,
            userId,
            commentId,
        );
    }
}
