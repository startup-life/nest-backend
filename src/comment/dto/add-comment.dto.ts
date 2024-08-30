import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCommentDto {
    @ApiProperty({
        type: String,
        description: '댓글 내용 (1~1000자)',
        example: '댓글 내용입니다.',
    })
    @IsNotEmpty()
    @IsString()
    @Length(1, 1000)
    commentContent: string;
}
