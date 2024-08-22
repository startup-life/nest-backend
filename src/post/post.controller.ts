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
    Request
} from '@nestjs/common';
import {PostService} from './post.service';
import {AddPostDto} from "./dto/add-post.dto";
import {UpdatePostDto} from "./dto/update-post.dto";
import {AuthGuard} from "@nestjs/passport";

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
    async getAllPosts(): Promise<any[]> {
        return await this.postService.getAllPosts();
    }

    @Get(':post_id')
    @UseGuards(AuthGuard('jwt'))
    async getPostById(@Param('post_id', ParseIntPipe) postId: number): Promise<any> {
        if (!postId) throw new BadRequestException('invalid postId');

        return await this.postService.getPostById(postId);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async addPost(
        @Request() request: any,
        @Body() addPostDto: AddPostDto,
    ): Promise<any> {
        const { userId, nickname } = request.user;

        return await this.postService.addPost(userId, nickname, addPostDto);
    }

    @Put(':post_id')
    @UseGuards(AuthGuard('jwt'))
    async updatePost(
        @Request() request: any,
        @Param('post_id', ParseIntPipe) postId: number,
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<any> {
        const { userId, nickname } = request.user;
        if (!postId) throw new BadRequestException('invalid postId');

        return await this.postService.updatePost(postId, userId, nickname, updatePostDto);
    }

    @Delete(':post_id')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(204)
    async deletePost(
        @Request() request: any,
        @Param('post_id', ParseIntPipe) postId: number,
    ): Promise<any> {
        const { userId } = request.user;
        if (!postId) throw new BadRequestException('invalid postId');

        return await this.postService.softDeletePost(postId, userId);
    }
}
