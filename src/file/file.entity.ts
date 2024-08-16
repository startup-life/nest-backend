import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file_table')
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filePath: string;

    @Column()
    fileCategory: number;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;
}
