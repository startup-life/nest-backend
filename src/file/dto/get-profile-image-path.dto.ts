import {IsNotEmpty, IsNumber} from "class-validator";

export class GetProfileImagePathDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    fileId: number;
}