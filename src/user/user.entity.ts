import {Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, DeleteDateColumn} from 'typeorm';
import { Post } from '../post/post.entity';
import { File } from '../file/file.entity';
import { Comment } from '../comment/comment.entity';

@Entity('user_table')
export class User {
    @PrimaryGeneratedColumn({ name: 'user_id', unsigned: true })
    userId: number;

    @Column({ type: 'varchar', length: 150, name: 'email' })
    email: string;

    @Column({ type: 'varchar', length: 150, name: 'password' })
    password: string;

    @Column({ type: 'varchar', length: 45, name: 'nickname' })
    nickname: string;

    @Column({ type: 'int', unsigned: true, name: 'file_id', nullable: true })
    fileId: number;

    @Column({ type: 'varchar', length: 150, name: 'session_id', nullable: true })
    sessionId: string;

    @Column({ type: 'timestamp', name: 'created_at', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', name: 'updated_at', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
    deletedAt: Date;

    @OneToMany(() => Post, post => post.user)
    posts: Post[];

    @OneToOne(() => File)
    @JoinColumn({ name: 'file_id' })
    files: File;

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];

    profileImagePath?: string;
    accessToken?: string;
}

/*
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post } from '../post/post.entity';
import { File } from '../file/file.entity';
import { Comment } from '../comment/comment.entity';

@Entity('user_table')
export class User {
    @PrimaryGeneratedColumn({ name: 'user_id', unsigned: true })
    userId: number;

    @Column({ type: 'varchar', length: 150 })
    email: string;

    @Column({ type: 'varchar', length: 150 })
    password: string;

    @Column({ type: 'varchar', length: 45 })
    nickname: string;

    @Column({ type: 'int', unsigned: true, nullable: true })
    fileId: number;

    @Column({ type: 'varchar', length: 150, nullable: true })
    sessionId: string;

    @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @OneToMany(() => Post, post => post.user)
    post: Post[];

    @OneToMany(() => File, file => file.user)
    file: File[];

    @OneToMany(() => Comment, comment => comment.user)
    comment: Comment[];

    // 프로필 이미지 경로를 가상 속성으로 추가
    profileImagePath?: string;
}
*/
