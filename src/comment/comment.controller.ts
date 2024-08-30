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
    Request,
    HttpCode,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentDto } from './dto/add-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get('post/:post_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiParam({
        name: 'post_id',
        required: true,
        description: '게시글 ID',
    })
    @ApiOkResponse({
        description: '게시글의 댓글 목록 조회 성공',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    commentId: { type: 'integer' },
                    postId: { type: 'integer' },
                    userId: { type: 'integer' },
                    nickname: { type: 'string' },
                    commentContent: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
        },
        example: [
            {
                commentId: 1,
                postId: 1,
                userId: 1,
                nickname: 'test1234',
                commentContent: '댓글 내용입니다.',
                createdAt: '0000-00-00T00:00:00.000Z',
                updatedAt: '0000-00-00T00:00:00.000Z',
            },
            {
                commentId: 2,
                postId: 1,
                userId: 2,
                nickname: 'test5678',
                commentContent: '댓글 내용입니다.',
                createdAt: '0000-00-00T00:00:00.000Z',
                updatedAt: '0000-00-00T00:00:00.000Z',
            },
        ],
    })
    @ApiBadRequestResponse({
        description: 'postId가 유효하지 않음',
        content: {
            'application/json': {
                example: {
                    statusCode: 400,
                    message: 'invalid postId',
                    error: 'Bad Request',
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: '인증되지 않은 사용자',
        content: {
            'application/json': {
                example: {
                    message: 'Unauthorized',
                    statusCode: 401,
                },
            },
        },
    })
    async getAllComments(
        @Param('post_id', ParseIntPipe) postId: number,
    ): Promise<any[]> {
        if (!postId) throw new BadRequestException('invalid postId');

        return await this.commentService.getAllComments(postId);
    }

    @Post('post/:post_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiParam({
        name: 'post_id',
        required: true,
        description: '게시글 ID',
    })
    @ApiBody({
        type: AddCommentDto,
        description: '댓글 추가 요청 데이터',
    })
    @ApiCreatedResponse({
        description: '댓글 추가 성공',
        schema: {
            type: 'object',
            properties: {
                postId: { type: 'integer' },
                userId: { type: 'integer' },
                nickname: { type: 'string' },
                commentContent: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                commentId: { type: 'integer' },
                deletedAt: { type: 'string', nullable: true },
            },
            example: {
                postId: 1,
                userId: 1,
                nickname: 'test1234',
                commentContent: '댓글 내용입니다.',
                createdAt: '0000-00-00T00:00:00.000Z',
                updatedAt: '0000-00-00T00:00:00.000Z',
                commentId: 1,
                deletedAt: null,
            },
        },
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        content: {
            'application/json': {
                examples: {
                    invalidCommentContent: {
                        summary: '댓글 내용이 유효하지 않음',
                        value: {
                            message: [
                                'commentContent must be a string',
                                'commentContent should not be empty',
                                'commentContent length must be between 1 and 1000 characters',
                            ],
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                    invalidPostId: {
                        summary: 'postId가 유효하지 않음',
                        value: {
                            statusCode: 400,
                            message: 'invalid postId',
                            error: 'Bad Request',
                        },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: '인증되지 않은 사용자',
        content: {
            'application/json': {
                example: {
                    message: 'Unauthorized',
                    statusCode: 401,
                },
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: '댓글 추가 실패',
        content: {
            'application/json': {
                example: {
                    statusCode: 500,
                    message: 'Failed to add comment',
                    error: 'Internal Server Error',
                },
            },
        },
    })
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
    @ApiBearerAuth()
    @ApiParam({
        name: 'post_id',
        required: true,
        description: '게시글 ID',
    })
    @ApiParam({
        name: 'comment_id',
        required: true,
        description: '댓글 ID',
    })
    @ApiBody({
        type: UpdateCommentDto,
        description: '댓글 수정 요청 데이터',
    })
    @ApiOkResponse({
        description: '댓글 수정 완료',
        schema: {
            type: 'object',
            properties: {
                commentId: { type: 'integer' },
                commentContent: { type: 'string' },
                postId: { type: 'integer' },
                userId: { type: 'integer' },
                nickname: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                deletedAt: { type: 'string', nullable: true },
            },
            example: {
                commentId: 1,
                commentContent: '댓글 내용입니다.',
                postId: 1,
                userId: 1,
                nickname: 'test1234',
                createdAt: '0000-00-00T00:00:00.000Z',
                updatedAt: '0000-00-00T00:00:00.000Z',
                deletedAt: null,
            },
        },
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        content: {
            'application/json': {
                examples: {
                    invalidCommentContent: {
                        summary: '댓글 내용이 유효하지 않음',
                        value: {
                            message: [
                                'commentContent must be a string',
                                'commentContent should not be empty',
                                'commentContent length must be between 1 and 1000 characters',
                            ],
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                    invalidPostId: {
                        summary: 'postId가 유효하지 않음',
                        value: {
                            statusCode: 400,
                            message: 'invalid postId',
                            error: 'Bad Request',
                        },
                    },
                    invalidCommentId: {
                        summary: 'commentId가 유효하지 않음',
                        value: {
                            statusCode: 400,
                            message: 'invalid commentId',
                            error: 'Bad Request',
                        },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: '인증되지 않은 사용자',
        content: {
            'application/json': {
                example: {
                    message: 'Unauthorized',
                    statusCode: 401,
                },
            },
        },
    })
    @ApiNotFoundResponse({
        description: '댓글이 존재하지 않음',
        content: {
            'application/json': {
                example: {
                    statusCode: 404,
                    message: 'not found comment',
                    error: 'Not Found',
                },
            },
        },
    })
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
    @ApiBearerAuth()
    @ApiParam({
        name: 'post_id',
        required: true,
        description: '게시글 ID',
    })
    @ApiParam({
        name: 'comment_id',
        required: true,
        description: '댓글 ID',
    })
    @ApiNoContentResponse({
        description: '댓글 삭제 성공',
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        content: {
            'application/json': {
                examples: {
                    invalidPostId: {
                        summary: 'postId가 유효하지 않음',
                        value: {
                            statusCode: 400,
                            message: 'invalid postId',
                            error: 'Bad Request',
                        },
                    },
                    invalidCommentId: {
                        summary: 'commentId가 유효하지 않음',
                        value: {
                            statusCode: 400,
                            message: 'invalid commentId',
                            error: 'Bad Request',
                        },
                    },
                },
            },
        },
    })
    @ApiNotFoundResponse({
        description: '댓글이 존재하지 않음',
        content: {
            'application/json': {
                example: {
                    statusCode: 404,
                    message: 'not found comment',
                    error: 'Not Found',
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: '인증되지 않은 사용자',
        content: {
            'application/json': {
                example: {
                    message: 'Unauthorized',
                    statusCode: 401,
                },
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: '댓글 삭제 실패',
        content: {
            'application/json': {
                example: {
                    statusCode: 500,
                    message: 'Failed to delete comment',
                    error: 'Internal Server Error',
                },
            },
        },
    })
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
