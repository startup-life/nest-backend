import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Entity('file_table')
export class File {
    @PrimaryGeneratedColumn({ name: 'file_id', unsigned: true })
    fileId: number;

    @Column({ type: 'int', unsigned: true, name: 'user_id' })
    userId: number;

    @Column({ type: 'int', unsigned: true, name: 'post_id', nullable: true })
    postId: number;

    @Column({ type: 'varchar', length: 125, name: 'file_path', nullable: true })
    filePath: string;

    @Column({ type: 'int', unsigned: true, name: 'file_category' })
    fileCategory: number;

    @Column({ type: 'timestamp', name: 'created_at', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', name: 'updated_at', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
    deletedAt: Date;

    @ManyToOne(() => User, user => user.files)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Post, post => post.files)
    @JoinColumn({ name: 'post_id' })
    post: Post;
}

/*
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Entity('file_table')
export class File {
    @PrimaryGeneratedColumn({ name: 'file_id', unsigned: true })
    fileId: number;

    @Column({ type: 'int', unsigned: true })
    userId: number;

    @Column({ type: 'int', unsigned: true, nullable: true })
    postId: number;

    @Column({ type: 'varchar', length: 125, nullable: true })
    filePath: string;

    @Column({ type: 'int', unsigned: true })
    fileCategory: number;

    @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @ManyToOne(() => User, user => user.file)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Post, post => post.file)
    @JoinColumn({ name: 'postId' })
    post: Post;
}
*/
