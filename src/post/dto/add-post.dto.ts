import {IsNotEmpty, IsString} from "class-validator";

export class AddPostDto {
    @IsNotEmpty()
    @IsString()
    postTitle: string;

    @IsNotEmpty()
    @IsString()
    postContent: string;
}