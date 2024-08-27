import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AddCommentDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 1000)
    commentContent: string;
}
