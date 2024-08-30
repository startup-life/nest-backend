import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
    @ApiProperty({
        type: String,
        description: '댓글 내용 (1~1000자)',
        example: '댓글 내용입니다.',
        required: true,
        minLength: 1,
        maxLength: 1000,
    })
    @IsNotEmpty()
    @IsString()
    @Length(1, 1000)
    commentContent: string;
}
