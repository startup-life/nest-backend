import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
    ) {}

    async getProfileImagePath(userId: number, fileId: number): Promise<string> {
        const file = await this.fileRepository.findOne({
            where: { userId, fileId, fileCategory: 0 },
        });

        if (file) {
            return file.filePath;
        }
        return '/public/image/profile/default.png';
    }

    async createProfileImage(userId: number, filePath: string): Promise<File> {
        const file = new File();
        file.userId = userId;
        file.filePath = filePath;
        file.fileCategory = 0;
        console.log('in createProfileImage');
        return await this.fileRepository.save(file);
    }

    async createPostImage(userId: number, postId: number, filePath: string): Promise<File> {
        const file = new File();
        file.userId = userId;
        file.postId = postId;
        file.filePath = filePath;
        file.fileCategory = 1;

        return await this.fileRepository.save(file);
    }
}
