import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FileService } from './file.service';
import { Post } from '../post/post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([File, Post])],
    providers: [FileService],
    exports: [FileService],
})
export class FileModule {}
