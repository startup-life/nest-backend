import {IsNotEmpty, IsString, Length} from "class-validator";

export class UpdateCommentDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 1000)
    commentContent: string;
}