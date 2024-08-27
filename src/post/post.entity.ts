import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    DeleteDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { File } from '../file/file.entity';
import { Comment } from '../comment/comment.entity';

@Entity('post_table')
export class Post {
    @PrimaryGeneratedColumn({ name: 'post_id', unsigned: true })
    postId: number;

    @Column({ type: 'varchar', length: 45, name: 'post_title' })
    postTitle: string;

    @Column({ type: 'text', name: 'post_content' })
    postContent: string;

    @Column({ type: 'int', unsigned: true, name: 'file_id', nullable: true })
    fileId: number;

    @Column({ type: 'int', unsigned: true, name: 'user_id' })
    userId: number;

    @Column({ type: 'varchar', length: 45, name: 'nickname' })
    nickname: string;

    @Column({ type: 'int', unsigned: true, name: 'like', default: 0 })
    like: number;

    @Column({ type: 'int', unsigned: true, name: 'comment_count', default: 0 })
    commentCount: number;

    @Column({ type: 'int', unsigned: true, name: 'hits', default: 0 })
    hits: number;

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
    deletedAt: Date;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => File, (file) => file.post)
    files: File[];

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];
}
