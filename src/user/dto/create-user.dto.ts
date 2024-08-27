import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    )
    password: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[가-힣a-zA-Z0-9]{2,10}$/)
    nickname: string;

    @IsOptional()
    @IsString()
    profileImagePath?: string;
}
