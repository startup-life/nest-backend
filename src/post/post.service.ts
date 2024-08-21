import {Injectable, NotFoundException} from '@nestjs/common';

@Injectable()
export class PostService {
    private posts: { postId: number; postTitle: string; postContent: string }[] = [
        { postId: 1, postTitle: 'First post', postContent: 'postContent of the first post' },
        { postId: 2, postTitle: 'Second post', postContent: 'postContent of the second post' },
        { postId: 3, postTitle: 'Third post', postContent: 'postContent of the third post' },
    ];

    async getAllPosts(): Promise<any[]> {
        return this.posts;
    }

    async getPostById(postId: number): Promise<any> {
        const post = this.posts.find(post => post.postId === postId);
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        return post;
    }

    async addPost(postTitle: string, postContent: string): Promise<any> {
        const newPost = {
            postId: this.posts.length + 1,
            postTitle,
            postContent,
        };
        this.posts.push(newPost);
        return newPost;
    }

    async updatePost(postId: number, postTitle: string, postContent: string): Promise<any> {
        const post = await this.getPostById(postId);
        post.postTitle = postTitle;
        post.postContent = postContent;
        return post;
    }

    async deletePost(postId: number): Promise<void> {
        const postIndex = this.posts.findIndex(post => post.postId === postId);
        if (postIndex === -1) {
            throw new NotFoundException('Post not found');
        }

        this.posts.splice(postIndex, 1);
    }
}
