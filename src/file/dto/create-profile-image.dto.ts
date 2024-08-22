import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateProfileImageDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsString()
    filePath: string;
}