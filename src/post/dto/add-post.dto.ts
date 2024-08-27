import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class AddPostDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 26)
    postTitle: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 1500)
    postContent: string;

    @IsOptional()
    @IsString()
    attachFilePath?: string;
}
