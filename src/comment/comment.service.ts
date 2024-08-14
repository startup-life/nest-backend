import {Injectable, NotFoundException} from '@nestjs/common';

@Injectable()
export class CommentService {
    private comments: { commentId: number; postId: number; commentContent: string }[] = [
        {
            commentId: 1,
            postId: 1, // 이 댓글이 속한 게시글의 ID
            commentContent: 'Comment content of the first comment',
        },
        {
            commentId: 2,
            postId: 1, // 이 댓글이 속한 게시글의 ID
            commentContent: 'Comment content of the second comment',
        },
        {
            commentId: 3,
            postId: 2, // 이 댓글이 속한 게시글의 ID
            commentContent: 'Comment content of the third comment',
        },
    ];

    async getComments() {
        return this.comments;
    }

    async getCommentById(commentId: number) {
        const comment = this.comments.find(comment => comment.commentId === commentId);
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }
        return comment;
    }

    async addComment(postId: number, commentContent: string) {
        const newComment = {
            commentId: this.comments.length + 1,
            postId,
            commentContent,
        };
        this.comments.push(newComment);
        return newComment;
    }

    async updateComment(commentId: number, commentContent: string) {
        const comment = await this.getCommentById(commentId);
        comment.commentContent = commentContent;
        return comment;
    }

    async deleteComment(commentId: number) {
        const commentIndex = this.comments.findIndex(comment => comment.commentId === commentId);
        if (commentIndex === -1) {
            throw new NotFoundException('Comment not found');
        }

        this.comments.splice(commentIndex, 1);
    }
}
