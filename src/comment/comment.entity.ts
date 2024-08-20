import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Entity('comment_table')
export class Comment {
    @PrimaryGeneratedColumn({ name: 'comment_id', unsigned: true })
    commentId: number;

    @Column({ type: 'text' })
    commentContent: string;

    @Column({ type: 'int', unsigned: true })
    postId: number;

    @Column({ type: 'int', unsigned: true })
    userId: number;

    @Column({ type: 'varchar', length: 45 })
    nickname: string;

    @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @ManyToOne(() => User, user => user.comments)
    user: User;

    @ManyToOne(() => Post, post => post.comments)
    post: Post;
}
