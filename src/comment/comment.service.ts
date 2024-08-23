import {Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Comment} from "./comment.entity";
import {Post} from "../post/post.entity";
import {AddCommentDto} from "./dto/add-comment.dto";
import {UpdateCommentDto} from "./dto/update-comment.dto";
import {PostService} from "../post/post.service";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,

        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) {}

    async getAllComments(postId: number): Promise<any> {
        const comments = await this.commentRepository
            .createQueryBuilder('ct')
            .leftJoinAndSelect('ct.user', 'ut')
            .leftJoinAndSelect('ut.files', 'ft')
            .select([
                'ct',
                'ut.userId',
                "COALESCE(ft.filePath, '/image//profile/default.jpg') AS profileImagePath",
            ])
            .where('ct.post_id = :postId', { postId })
            .andWhere('ct.deleted_at IS NULL')
            .getRawMany();

        if (comments.length === 0) return null;

        return comments.map(comment => {
            return {
                commentId: comment.ct_comment_id,
                postId: comment.ct_post_id,
                userId: comment.ut_user_id,
                nickname: comment.ct_nickname,
                commentContent: comment.ct_comment_content,
                profileImagePath: comment.profileImagePath,
                createdAt: comment.ct_created_at,
                updatedAt: comment.ct_updated_at,
            };
        });
    }

    async addComment(postId: number, userId: number, nickname: string, addCommentDto: AddCommentDto): Promise<Comment> {
        const { commentContent } = addCommentDto;

        // 댓글 생성
        const comment = new Comment();
        comment.postId = postId;
        comment.userId = userId;
        comment.nickname = nickname;
        comment.commentContent = commentContent;

        const newComment = await this.commentRepository.save(comment);

        // 게시글 댓글 수 증가
        if (!newComment) throw new InternalServerErrorException('Failed to add comment');
        await this.incrementCommentCount(postId);

        return comment;
    }

    async updateComment(postId: number, commentId: number, userId: number, nickname: string, updateCommentDto: UpdateCommentDto): Promise<any> {
        const { commentContent } = updateCommentDto;

        // 댓글 존재 여부 확인
        const comment = await this.commentRepository.findOne({where: { commentId, userId, postId }});
        if (!comment) throw new NotFoundException('not found comment');

        // 댓글 수정
        comment.commentContent = commentContent;
        comment.nickname = nickname;
        await this.commentRepository.save(comment);

        return comment;
    }

    async softDeleteComment(postId: number, userId: number, commentId: number): Promise<any> {
        // 댓글 존재 여부 확인
        const comment = await this.commentRepository.findOne({where: { commentId, postId, userId }});
        if (!comment) throw new NotFoundException('not found comment');

        // 댓글 삭제
        const deleteComment = await this.commentRepository.softDelete(comment.commentId);

        // 게시글 댓글 수 감소
        if (!deleteComment) throw new InternalServerErrorException('Failed to delete comment');
        await this.decrementCommentCount(postId);
    }

    // private methods

    private async incrementCommentCount(postId: number): Promise<void> {
        await this.postRepository.increment({ postId }, 'commentCount', 1);
    }

    private async decrementCommentCount(postId: number): Promise<void> {
        await this.postRepository.decrement({ postId }, 'commentCount', 1);
    }
}
