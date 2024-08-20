import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
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

    @ManyToOne(() => User, user => user.files)
    user: User;

    @ManyToOne(() => Post, post => post.files)
    post: Post;
}
