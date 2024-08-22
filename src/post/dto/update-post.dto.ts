import {IsNotEmpty, IsString} from "class-validator";

export class UpdatePostDto {
    @IsNotEmpty()
    @IsString()
    postTitle: string;

    @IsNotEmpty()
    @IsString()
    postContent: string;
}