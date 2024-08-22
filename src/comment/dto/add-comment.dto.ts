import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class AddCommentDto {
    @IsNotEmpty()
    @IsNumber()
    postId: number;

    @IsNotEmpty()
    @IsString()
    commentContent: string;
}