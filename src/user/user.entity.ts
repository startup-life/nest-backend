import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_table')
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    email: string;

    @Column()
    password: string;


    @Column()
    nickname: string;

    @Column({ nullable: true })
    fileId: number;

    @Column({ nullable: true })
    profileImagePath: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;
}
