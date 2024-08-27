import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostImageDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    postId: number;

    @IsNotEmpty()
    @IsString()
    filePath: string;
}
