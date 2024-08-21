import {Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    async getPosts(): Promise<any[]> {
        return await this.postService.getAllPosts();
    }

    @Get(':post_id')
    async getPost(@Param('post_id', ParseIntPipe) postId: number): Promise<any> {
        return await this.postService.getPostById(postId);
    }

    @Post()
    async addPost(@Body() body: { postTitle: string; postContent: string }): Promise<any> {
        return await this.postService.addPost(body.postTitle, body.postContent);
    }

    @Put(':post_id')
    async updateUser(
        @Param('post_id', ParseIntPipe) postId: number,
        @Body() body: { postTitle: string; postContent: string },
    ): Promise<any> {
        return await this.postService.updatePost(postId, body.postTitle, body.postContent);
    }

    @Delete(':post_id')
    async deleteUser(@Param('post_id', ParseIntPipe) postId: number): Promise<void> {
        return await this.postService.deletePost(postId);
    }
}
