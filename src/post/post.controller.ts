import {Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    async getPosts() {
        const posts = await this.postService.getAllPosts();
        return posts;
    }

    @Get(':post_id')
    async getPost(@Param('post_id', ParseIntPipe) postId: number) {
        const post = await this.postService.getPostById(postId);
        return post;
    }

    @Post()
    async addPost(@Body() body: { postTitle: string; postContent: string }) {
        const newPost = await this.postService.addPost(body.postTitle, body.postContent);
        return newPost;
    }

    @Put(':post_id')
    async updateUser(
        @Param('post_id', ParseIntPipe) postId: number,
        @Body() body: { postTitle: string; postContent: string },
    ) {
        const updatePost = await this.postService.updatePost(postId, body.postTitle, body.postContent);
        return updatePost;
    }

    @Delete(':post_id')
    async deleteUser(@Param('post_id', ParseIntPipe) postId: number) {
        await this.postService.deletePost(postId);
        return null; // DELETE 요청이므로 성공 시 본문이 없음을 의미하는 null 반환
    }
}
