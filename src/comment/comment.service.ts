import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Comment} from "./comment.entity";
import {Post} from "../post/post.entity";
import {File} from "../file/file.entity";
import {UserService} from "../user/user.service";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,

        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,

        private readonly userService: UserService,
    ) {}

    async getComments(postId: number): Promise<any> {
        const comments = await this.commentRepository
            .createQueryBuilder('ct')
            .leftJoinAndSelect('ct.user', 'ut')
            .leftJoinAndSelect('ut.files', 'ft')
            .select([
                'ct',
                'ut.userId',
                "COALESCE(ft.filePath, '/public/image/profile/default.jpg') AS profileImagePath",
            ])
            .where('ct.post_id = :postId', { postId })
            .andWhere('ct.deleted_at IS NULL')
            .getRawMany();

        if (!comments || comments.length === 0) return null;

        // ct_comment_id 이런식이 아니라 comment_id 로 원래 컬럼의 이름으로 리턴
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

    async addComment(
        requestBody: {
            postId: number,
            userId: number,
            commentContent: string
        }
    ): Promise<any> {
        const { postId, userId, commentContent } = requestBody;

        const writerNickname = await this.userService.getNickname(userId);

        const post = await this.postRepository.findOne({where: { postId }});
        if (!post) {
            throw new NotFoundException('not found post');
        }

        const comment = new Comment();
        comment.postId = postId;
        comment.userId = userId;
        comment.commentContent = commentContent;
        comment.nickname = writerNickname
        await this.commentRepository.save(comment);

        // 게시글 댓글 수 증가
        const commentCount = post.commentCount + 1;
        await this.postRepository.update({ postId }, { commentCount });

        return comment;
    }

    async updateComment(
        requestBody: {
            postId: number,
            userId: number,
            commentId: number,
            commentContent: string
        }
    ): Promise<any> {
        const { postId, userId, commentId, commentContent } = requestBody;

        const checkPost = await this.postRepository.findOne({where: { postId }});
        if (!checkPost) {
            throw new NotFoundException('not found post');
        }

        const comment = await this.commentRepository.findOne({where: { commentId }});
        if (!comment) {
            throw new NotFoundException('not found comment');
        }

        const isCommentOnPost = comment.postId === postId;
        if (!isCommentOnPost) {
            throw new NotFoundException('not found comment on post');
        }

        const checkWriter = comment.userId === userId;
        if (!checkWriter) throw new UnauthorizedException('invalid user');

        const writerNickname = await this.userService.getNickname(userId);

        comment.commentContent = commentContent;
        comment.nickname = writerNickname
        await this.commentRepository.save(comment);

        return comment;
    }

    async softDeleteComment(
        requestBody: {
            postId: number,
            userId: number,
            commentId: number
        }
    ): Promise<any> {
        const { postId, userId, commentId } = requestBody;

        const post = await this.postRepository.findOne({where: { postId }});
        if (!post) {
            throw new NotFoundException('not found post');
        }

        const comment = await this.commentRepository.findOne({where: { commentId }});
        if (!comment) {
            throw new NotFoundException('not found comment');
        }

        const isCommentOnPost = comment.postId === postId;
        if (!isCommentOnPost) {
            throw new NotFoundException('not found comment on post');
        }

        const checkWriter = comment.userId === userId;
        if (!checkWriter) throw new UnauthorizedException('invalid user');

        comment.deletedAt = new Date();
        await this.commentRepository.save(comment);

        // 게시글 댓글 수 감소
        const commentCount = post.commentCount - 1;
        await this.postRepository.update({ postId }, { commentCount });

        return comment;
    }
}
