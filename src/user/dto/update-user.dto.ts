import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[가-힣a-zA-Z0-9]{2,10}$/)
    nickname: string;

    @IsOptional()
    @IsString()
    profileImagePath?: string;
}
