import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
    @ApiProperty({
        description: '게시글 제목 (1~26자)',
        example: '게시글 제목입니다.',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    @Length(1, 26)
    postTitle: string;

    @ApiProperty({
        description: '게시글 내용 (1~1500자)',
        example: '게시글 내용입니다.',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    @Length(1, 1500)
    postContent: string;

    @ApiProperty({
        description: '첨부 파일 경로',
        example: 'image/post/test.jpg',
        required: false,
        type: String,
    })
    @IsOptional()
    @IsString()
    attachFilePath?: string;
}
