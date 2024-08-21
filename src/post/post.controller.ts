import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode, NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query
} from '@nestjs/common';
import { PostService } from './post.service';

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
    async getAllPosts(): Promise<any[]> {
        const posts = await this.postService.getAllPosts();
        return posts;
    }

    @Get(':post_id')
    async getPostById(@Param('post_id', ParseIntPipe) postId: number): Promise<any> {
        if (!postId) {
            throw new BadRequestException('invalid postId');
        }

        const post = await this.postService.getPostById(postId);

        if (!post) {
            throw new BadRequestException('not found post');
        }

        return post;
    }

    @Post()
    async addPost(
        @Query('userid') userId: number,
        @Body('postTitle') postTitle: string,
        @Body('postContent') postContent: string,
        @Body('attachFilePath') attachFilePath?: string,
    ): Promise<any> {
        if (!userId) {
            throw new BadRequestException('invalid userId');
        }

        if (!postTitle) {
            throw new BadRequestException('postTitle is required');
        }

        if (postTitle.length > 26) {
            throw new BadRequestException('postTitle must be less than 26 characters');
        }

        if (!postContent) {
            throw new BadRequestException('postContent is required');
        }

        if (postContent.length > 1500) {
            throw new BadRequestException('postContent must be less than 1500 characters');
        }

        const requestBody = {
            userId,
            postTitle,
            postContent,
            attachFilePath,
        };
        const post = await this.postService.addPost(requestBody);

        return post;
    }

    @Put(':post_id')
    async updatePost(
        @Param('post_id', ParseIntPipe) postId: number,
        @Body('postTitle') postTitle: string,
        @Body('postContent') postContent: string,
        @Body('attachFilePath') attachFilePath?: string,
    ): Promise<any> {
        if (!postId) {
            throw new BadRequestException('invalid postId');
        }

        if (!postTitle) {
            throw new BadRequestException('postTitle is required');
        }

        if (postTitle.length > 26) {
            throw new BadRequestException('postTitle must be less than 26 characters');
        }

        if (!postContent) {
            throw new BadRequestException('postContent is required');
        }

        if (postContent.length > 1500) {
            throw new BadRequestException('postContent must be less than 1500 characters');
        }

        const requestBody = {
            postId,
            postTitle,
            postContent,
            attachFilePath,
        }

        const post = await this.postService.updatePost(requestBody);

        if (!post) {
            throw new NotFoundException('not found post');
        }

        return post;
    }

    @Delete(':post_id')
    @HttpCode(204)
    async deletePost(@Param('post_id', ParseIntPipe) postId: number): Promise<any> {
        if (!postId) {
            throw new BadRequestException('invalid postId');
        }

        const post = await this.postService.softDeletePost(postId);
        return post;
    }
}
