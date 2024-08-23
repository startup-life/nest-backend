import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import {GetProfileImagePathDto} from "./dto/get-profile-image-path.dto";
import {CreateProfileImageDto} from "./dto/create-profile-image.dto";
import {CreatePostImageDto} from "./dto/create-post-image.dto";

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
    ) {}

    async getProfileImagePath(getProfileImagePathDto: GetProfileImagePathDto): Promise<string> {
        const { userId, fileId } = getProfileImagePathDto;

        const file = await this.fileRepository.findOne({
            where: { userId, fileId, fileCategory: 0 },
        });

        if (file) return file.filePath;

        return '/image/profile/default.jpg';
    }

    async createProfileImage(createProfileImageDto: CreateProfileImageDto): Promise<File> {
        const { userId, filePath } = createProfileImageDto;

        const file = new File();
        file.userId = userId;
        file.filePath = filePath;
        file.fileCategory = 0;

        return await this.fileRepository.save(file);
    }

    async createPostImage(createPostImageDto: CreatePostImageDto): Promise<File> {
        const { userId, postId, filePath } = createPostImageDto;

        const file = new File();
        file.userId = userId;
        file.postId = postId;
        file.filePath = filePath;
        file.fileCategory = 1;

        return await this.fileRepository.save(file);
    }
}
