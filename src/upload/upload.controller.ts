import {BadRequestException, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {UploadService} from "./upload.service";

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    // 프로필 이미지 업로드
    @Post('profile')
    @UseInterceptors(
        FileInterceptor('profileImage', {
            storage: diskStorage({
                destination: UploadService.PROFILE_IMAGE_PATH,
                filename: (req, file, cb) => {
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    uploadProfileFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadService.uploadProfileFile(file);
    }
    /*@Post('profile')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './public/image/profile',
                filename: (req, file, cb) => {
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    uploadProfileFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Invalid file');
        }
        if (!file.mimetype.includes('image')) {
            throw new BadRequestException('Invalid file type');
        }

        return `/public/image/profile/${file.filename}`;
    }*/

    // 게시물 이미지 업로드
    @Post('post')
    @UseInterceptors(
        FileInterceptor('postImage', {
            storage: diskStorage({
                destination: UploadService.POST_IMAGE_PATH,
                filename: (req, file, cb) => {
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    uploadPostFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadService.uploadPostFile(file);
    }
/*    @Post('post')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './public/image/post',
                filename: (req, file, cb) => {
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    uploadPostFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new Error('Invalid file');
        }
        return `/public/image/post/${file.filename}`;
    }*/
}
