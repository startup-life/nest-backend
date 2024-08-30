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
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    // 프로필 이미지 업로드
    @Post('profile')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: '프로필 이미지 업로드',
        schema: {
            type: 'object',
            properties: {
                profileImage: {
                    type: 'string',
                    format: 'binary',
                    description: '프로필 이미지',
                },
            },
        },
    })
    @ApiCreatedResponse({
        description: '프로필 이미지 업로드 성공',
        content: {
            'text/plain': {
                schema: {
                    type: 'string',
                    example: '/image/profile/test.jpg',
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        content: {
            'application/json': {
                examples: {
                    invalidFile: {
                        summary: '잘못된 파일',
                        value: {
                            message: 'Invalid file',
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                    invalidFileType: {
                        summary: '잘못된 파일 타입',
                        value: {
                            message: 'Invalid file type',
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                },
            },
        },
    })
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
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: '게시물 이미지 업로드',
        schema: {
            type: 'object',
            properties: {
                postImage: {
                    type: 'string',
                    format: 'binary',
                    description: '게시물 이미지',
                },
            },
        },
    })
    @ApiCreatedResponse({
        description: '게시물 이미지 업로드 성공',
        content: {
            'text/plain': {
                schema: {
                    type: 'string',
                    example: '/image/post/test.jpg',
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        content: {
            'application/json': {
                examples: {
                    invalidFile: {
                        summary: '잘못된 파일',
                        value: {
                            message: 'Invalid file',
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                    invalidFileType: {
                        summary: '잘못된 파일 타입',
                        value: {
                            message: 'Invalid file type',
                            error: 'Bad Request',
                            statusCode: 400,
                        },
                    },
                },
            },
        },
    })
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
