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
    Query, UnauthorizedException
} from '@nestjs/common';
import {PostService} from './post.service';
import {AddPostDto} from "./dto/add-post.dto";
import {UpdatePostDto} from "./dto/update-post.dto";

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
        return await this.postService.getAllPosts();
    }

    @Get(':post_id')
    async getPostById(@Param('post_id', ParseIntPipe) postId: number): Promise<any> {
        if (!postId) throw new BadRequestException('invalid postId');

        await this.postService.incrementPostViews(postId);
        return await this.postService.getPostById(postId);
    }

    @Post()
    async addPost(
        @Query('userid', ParseIntPipe) userId: number,
        @Query('nickname') nickname: string,
        @Body() addPostDto: AddPostDto,
    ): Promise<any> {
        if (!userId) throw new BadRequestException('invalid userId');
        if (!nickname) throw new BadRequestException('invalid nickname');

        return await this.postService.addPost(userId, nickname, addPostDto);
    }

    @Put(':post_id')
    async updatePost(
        @Param('post_id', ParseIntPipe) postId: number,
        @Query('userid', ParseIntPipe) userId: number,
        @Query('nickname') nickname: string,
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<any> {
        if (!postId) throw new BadRequestException('invalid postId');
        if (!userId) throw new BadRequestException('invalid userId');
        if (!nickname) throw new BadRequestException('invalid nickname');

        return await this.postService.updatePost(postId, userId, nickname, updatePostDto);
    }

    @Delete(':post_id')
    @HttpCode(204)
    async deletePost(
        @Param('post_id', ParseIntPipe) postId: number,
        @Query('userid', ParseIntPipe) userId: number,
    ): Promise<any> {
        if (!userId) throw new BadRequestException('invalid userId');
        if (!postId) throw new BadRequestException('invalid postId');

        return await this.postService.softDeletePost(postId, userId);
    }
}
