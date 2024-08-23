import { Injectable, BadRequestException } from '@nestjs/common';
import { diskStorage } from "multer";
import { extname } from "path";

@Injectable()
export class UploadService {
    public static readonly PROFILE_IMAGE_PATH = './public/image/profile';
    public static readonly POST_IMAGE_PATH = './public/image/post';

    // 서비스 코드
    uploadProfileFile(file: Express.Multer.File): string {
        if (!file) {
            throw new BadRequestException('Invalid file');
        }
        if (!file.mimetype.includes('image')) {
            throw new BadRequestException('Invalid file type');
        }

        // 파일 이름을 서비스에서 다시 생성하지 않고, 컨트롤러에서 넘어온 파일 객체의 이름을 사용
        return `/image/profile/${file.filename}`;
    }

    uploadPostFile(file: Express.Multer.File): string {
        if (!file) {
            throw new BadRequestException('Invalid file');
        }
        if (!file.mimetype.includes('image')) {
            throw new BadRequestException('Invalid file type');
        }

        // 컨트롤러에서 넘어온 파일 객체의 이름을 사용하여 반환
        return `/image/post/${file.filename}`;
    }
}
