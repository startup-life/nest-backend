import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { File } from '../file/file.entity';
import { Comment } from '../comment/comment.entity';

@Entity('post_table')
export class Post {
    @PrimaryGeneratedColumn({ name: 'post_id', unsigned: true })
    postId: number;

    @Column({ type: 'varchar', length: 45 })
    postTitle: string;

    @Column({ type: 'text' })
    postContent: string;

    @Column({ type: 'int', unsigned: true, nullable: true })
    fileId: number;

    @Column({ type: 'int', unsigned: true })
    userId: number;

    @Column({ type: 'varchar', length: 45 })
    nickname: string;

    @Column({ type: 'int', unsigned: true, default: 0 })
    like: number;

    @Column({ type: 'int', unsigned: true, default: 0 })
    commentCount: number;

    @Column({ type: 'int', unsigned: true, default: 0 })
    hits: number;

    @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @ManyToOne(() => User, user => user.posts)
    user: User;

    @OneToMany(() => File, file => file.post) // File 엔티티와의 관계 설정
    files: File[];

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[];
}
