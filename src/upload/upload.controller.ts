import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    // 프로필 이미지 업로드
    @Post('profile')
    @UseInterceptors(
        FileInterceptor('profileImage', {
            storage: diskStorage({
                destination: UploadService.PROFILE_IMAGE_PATH,
                filename: (request, file, cb) => {
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    const filename = `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`;
                    file.filename = filename; // 파일 객체에 파일 이름을 저장
                    cb(null, filename);
                },
            }),
        }),
    )
    uploadProfileFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadService.uploadProfileFile(file);
    }

    // 게시물 이미지 업로드
    @Post('post')
    @UseInterceptors(
        FileInterceptor('postImage', {
            storage: diskStorage({
                destination: UploadService.POST_IMAGE_PATH,
                filename: (request, file, cb) => {
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    const filename = `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`;
                    file.filename = filename; // 파일 객체에 파일 이름을 저장
                    cb(null, filename);
                },
            }),
        }),
    )
    uploadPostFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadService.uploadPostFile(file);
    }
}
