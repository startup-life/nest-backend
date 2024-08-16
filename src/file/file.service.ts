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

    async getProfileImagePath(fileId: number): Promise<string> {
        const file = await this.fileRepository.findOne({
            where: { id: fileId, deletedAt: null, fileCategory: 1 },
        });

        if (file) {
            return file.filePath;
        }
        return '/public/image/profile/default.png';
    }
}
