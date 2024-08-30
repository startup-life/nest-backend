import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AddPostDto } from './dto/add-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
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
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('post')
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    /**
     * 게시글 목록 조회
     * 게시글 상세 조회
     * 게시글 작성
     * 게시글 수정
     * 게시글 삭제
     */

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiQuery({
        name: 'offset',
        required: true,
        description: '결과의 시작 지점',
        example: 0,
        type: Number,
    })
    @ApiQuery({
        name: 'limit',
        required: true,
        description: '한 번에 가져올 결과의 개수',
        example: 5,
        type: Number,
    })
    @ApiOkResponse({
        description: '게시글 목록 조회 성공',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    postId: { type: 'integer' },
                    postTitle: { type: 'string' },
                    postContent: { type: 'string' },
                    postLike: { type: 'string' },
                    postCommentCount: { type: 'string' },
                    postHits: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    deletedAt: { type: 'string', nullable: true },
                    userId: { type: 'integer' },
                    nickname: { type: 'string' },
                    profileImagePath: { type: 'string' },
                    postFiles: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                fileId: { type: 'integer' },
                                filePath: { type: 'string' },
                                fileCategory: { type: 'integer' },
                                createdAt: {
                                    type: 'string',
                                    format: 'date-time',
                                },
                                updatedAt: {
                                    type: 'string',
                                    format: 'date-time',
                                },
                                deletedAt: { type: 'string', nullable: true },
                            },
                        },
                    },
                },
            },
        },
        example: {
            postId: 1,
            postTitle: '게시글 제목',
            postContent: '게시글 내용',
            postLike: '1K',
            postCommentCount: '1K',
            postHits: '1K',
            createdAt: '0000-00-00T00:00:00.000Z',
            updatedAt: '0000-00-00T00:00:00.000Z',
            deletedAt: null,
            userId: 1,
            nickname: 'test1234',
            profileImagePath: 'image/profile/test.jpg',
            postFiles: [
                {
                    fileId: 2,
                    filePath: 'image/post/test.jpg',
                    fileCategory: 1,
                    createdAt: '0000-00-00T00:00:00.000Z',
                    updatedAt: '0000-00-00T00:00:00.000Z',
                    deletedAt: null,
                },
            ],
        },
    })
    @ApiBadRequestResponse({
        description: '잘못된 offset 또는 limit',
        content: {
            'application/json': {
                example: {
                    message: 'invalid offset or limit',
                    error: 'Bad Request',
                    statusCode: 400,
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
    async getAllPosts(
        @Query('offset') offset: number,
        @Query('limit') limit: number,
    ): Promise<any[]> {
        if (!offset || !limit)
            throw new BadRequestException('invalid offset or limit');
        return await this.postService.getAllPosts(offset, limit);
    }

    @Get(':post_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiParam({
        name: 'post_id',
        required: true,
        description: '게시글 ID',
        example: 1,
    })
    @ApiOkResponse({
        description: '게시글 상세 조회 성공',
        schema: {
            type: 'object',
            properties: {
                postId: { type: 'integer' },
                postTitle: { type: 'string' },
                postContent: { type: 'string' },
                fileId: { type: 'integer' },
                userId: { type: 'integer' },
                nickname: { type: 'string' },
                like: { type: 'string' },
                commentCount: { type: 'string' },
                hits: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                deletedAt: { type: 'string', nullable: true },
                profileImagePath: { type: 'string' },
                filePath: { type: 'string', nullable: true },
                commentsCount: { type: 'string' },
            },
        },
        example: {
            postId: 1,
            postTitle: '게시글 제목',
            postContent: '게시글 내용',
            fileId: 2,
            userId: 1,
            nickname: 'test1234',
            like: '1K',
            commentCount: '1K',
            hits: '1K',
            createdAt: '0000-00-00T00:00:00.000Z',
            updatedAt: '0000-00-00T00:00:00.000Z',
            deletedAt: null,
            profileImagePath: 'image/profile/test.jpg',
            filePath: 'image/post/test.jpg',
            commentsCount: '1K',
        },
    })
    @ApiBadRequestResponse({
        description: '잘못된 postId',
        content: {
            'application/json': {
                example: {
                    message: 'invalid postId',
                    error: 'Bad Request',
                    statusCode: 400,
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
        description: '해당 게시글 없음',
        content: {
            'application/json': {
                example: {
                    message: 'post not found',
                    error: 'Not Found',
                    statusCode: 404,
                },
            },
        },
    })
    async getPostById(
        @Param('post_id', ParseIntPipe) postId: number,
    ): Promise<any> {
        if (!postId) throw new BadRequestException('invalid postId');
        await this.postService.incrementPostViews(postId);
        return await this.postService.getPostById(postId);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiBody({
        description: '게시글 작성',
        type: AddPostDto,
    })
    @ApiCreatedResponse({
        description: '게시글 작성 성공',
        schema: {
            type: 'object',
            properties: {
                postId: { type: 'integer' },
                postTitle: { type: 'string' },
                postContent: { type: 'string' },
                fileId: { type: 'integer' },
                userId: { type: 'integer' },
                nickname: { type: 'string' },
                like: { type: 'string' },
                commentCount: { type: 'string' },
                hits: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                deletedAt: { type: 'string', nullable: true },
                profileImagePath: { type: 'string' },
                filePath: { type: 'string', nullable: true },
                commentsCount: { type: 'string' },
            },
        },
        example: {
            postId: 1,
            postTitle: '게시글 제목',
            postContent: '게시글 내용',
            fileId: 2,
            userId: 1,
            nickname: 'test1234',
            like: '1K',
            commentCount: '1K',
            hits: '1K',
            createdAt: '0000-00-00T00:00:00.000Z',
            updatedAt: '0000-00-00T00:00:00.000Z',
            deletedAt: null,
            profileImagePath: 'image/profile/test.jpg',
            filePath: 'image/post/test.jpg',
            commentsCount: '1K',
        },
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        content: {
            'application/json': {
                examples: {
                    invalidPostTitle: {
                        summary: '게시글 제목 형식 오류',
                        value: {
                            message: [
                                'postTitle should not be empty',
                                'postTitle must be shorter than or equal to 26 characters',
                            ],
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                    invalidPostContent: {
                        summary: '게시글 내용 형식 오류',
                        value: {
                            message: [
                                'postContent should not be empty',
                                'postContent must be shorter than or equal to 1500 characters',
                            ],
                            error: 'Bad Request',
                            statusCode: 400,
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
        description: '게시글 작성 실패',
        content: {
            'application/json': {
                example: {
                    message: 'Failed create post',
                    error: 'Internal Server Error',
                    statusCode: 500,
                },
            },
        },
    })
    async addPost(
        @Request() request: any,
        @Body() addPostDto: AddPostDto,
    ): Promise<any> {
        const { userId, nickname } = request.user;

        return await this.postService.addPost(userId, nickname, addPostDto);
    }

    @Put(':post_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiParam({
        name: 'post_id',
        required: true,
        description: '게시글 ID',
        example: 1,
    })
    @ApiBody({
        description: '게시글 수정',
        type: UpdatePostDto,
    })
    @ApiOkResponse({
        description: '게시글 수정 성공',
        schema: {
            type: 'object',
            properties: {
                postId: { type: 'integer' },
                postTitle: { type: 'string' },
                postContent: { type: 'string' },
                fileId: { type: 'integer' },
                userId: { type: 'integer' },
                nickname: { type: 'string' },
                like: { type: 'string' },
                commentCount: { type: 'string' },
                hits: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                deletedAt: { type: 'string', nullable: true },
                profileImagePath: { type: 'string' },
                filePath: { type: 'string', nullable: true },
                commentsCount: { type: 'string' },
            },
        },
        example: {
            postId: 1,
            postTitle: '게시글 제목',
            postContent: '게시글 내용',
            fileId: 2,
            userId: 1,
            nickname: 'test1234',
            like: '1K',
            commentCount: '1K',
            hits: '1K',
            createdAt: '0000-00-00T00:00:00.000Z',
            updatedAt: '0000-00-00T00:00:00.000Z',
            deletedAt: null,
            profileImagePath: 'image/profile/test.jpg',
            filePath: 'image/post/test.jpg',
            commentsCount: '1K',
        },
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        content: {
            'application/json': {
                examples: {
                    invalidPostTitle: {
                        summary: '게시글 제목 형식 오류',
                        value: {
                            message: [
                                'postTitle should not be empty',
                                'postTitle must be shorter than or equal to 26 characters',
                            ],
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                    invalidPostContent: {
                        summary: '게시글 내용 형식 오류',
                        value: {
                            message: [
                                'postContent should not be empty',
                                'postContent must be shorter than or equal to 1500 characters',
                            ],
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                    invalidPostId: {
                        summary: '게시글 ID 형식 오류',
                        value: {
                            message: 'invalid postId',
                            error: 'Bad Request',
                            statusCode: 400,
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
        description: '해당 게시글 없음',
        content: {
            'application/json': {
                example: {
                    message: 'Post not found',
                    error: 'Not Found',
                    statusCode: 404,
                },
            },
        },
    })
    async updatePost(
        @Request() request: any,
        @Param('post_id', ParseIntPipe) postId: number,
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<any> {
        const { userId, nickname } = request.user;
        if (!postId) throw new BadRequestException('invalid postId');

        return await this.postService.updatePost(
            postId,
            userId,
            nickname,
            updatePostDto,
        );
    }

    @Delete(':post_id')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(204)
    @ApiBearerAuth()
    @ApiParam({
        name: 'post_id',
        required: true,
        description: '게시글 ID',
        example: 1,
    })
    @ApiNoContentResponse({ description: '게시글 삭제 성공' })
    @ApiBadRequestResponse({
        description: 'postId 파라미터가 없음',
        content: {
            'application/json': {
                example: {
                    message: 'invalid postId',
                    error: 'Bad Request',
                    statusCode: 400,
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
        description: '해당 게시글 없음',
        content: {
            'application/json': {
                example: {
                    message: 'Post not found',
                    error: 'Not Found',
                    statusCode: 404,
                },
            },
        },
    })
    async deletePost(
        @Request() request: any,
        @Param('post_id', ParseIntPipe) postId: number,
    ): Promise<any> {
        const { userId } = request.user;
        if (!postId) throw new BadRequestException('invalid postId');

        return await this.postService.softDeletePost(postId, userId);
    }
}
