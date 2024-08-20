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
    posts: Post[];

    @OneToMany(() => File, file => file.user)
    files: File[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];

    // 프로필 이미지 경로를 가상 속성으로 추가
    profileImagePath?: string;
}
