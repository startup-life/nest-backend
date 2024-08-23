import { Injectable, BadRequestException } from '@nestjs/common';
import { diskStorage } from "multer";
import { extname } from "path";

@Injectable()
export class UploadService {
    public static readonly PROFILE_IMAGE_PATH = './public/image/profile';
    public static readonly POST_IMAGE_PATH = './public/image/post';

    uploadProfileFile(file: Express.Multer.File): string {
        if (!file) {
            throw new BadRequestException('Invalid file');
        }
        if (!file.mimetype.includes('image')) {
            throw new BadRequestException('Invalid file type');
        }

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`;

        // 파일 저장 로직 (여기서는 예시로 파일 이름 반환)
        return `/image//profile/${filename}`;
    }

    uploadPostFile(file: Express.Multer.File): string {
        if (!file) {
            throw new BadRequestException('Invalid file');
        }
        if (!file.mimetype.includes('image')) {
            throw new BadRequestException('Invalid file type');
        }

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`;

        // 파일 저장 로직 (여기서는 예시로 파일 이름 반환)
        return `/image//post/${filename}`;
    }
}
