import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    DeleteDateColumn,
} from 'typeorm';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';

@Entity('comment_table')
export class Comment {
    @PrimaryGeneratedColumn({ name: 'comment_id', unsigned: true })
    commentId: number;

    @Column({ type: 'text', name: 'comment_content' })
    commentContent: string;

    @Column({ type: 'int', unsigned: true, name: 'post_id' })
    postId: number;

    @Column({ type: 'int', unsigned: true, name: 'user_id' })
    userId: number;

    @Column({ type: 'varchar', length: 45, name: 'nickname' })
    nickname: string;

    @Column({
        type: 'timestamp',
        name: 'created_at',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        name: 'updated_at',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => Post, (post) => post.comments)
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @ManyToOne(() => User, (user) => user.comments)
    @JoinColumn({ name: 'user_id' })
    user: User;
}

/*
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

    @ManyToOne(() => User, user => user.comment)
    user: User;

    @ManyToOne(() => Post, post => post.comment)
    post: Post;
}
*/
