import {IsNotEmpty, IsString} from "class-validator";

export class AddUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;
}