import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpUserDto {
    @ApiProperty({
        type: String,
        description: '이메일',
        example: 'test@test.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        type: String,
        description: '비밀번호 (8~20자, 대소문자, 숫자, 특수문자 포함)',
        example: 'passworD1234!',
    })
    @IsNotEmpty()
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    )
    password: string;

    @ApiProperty({
        type: String,
        description: '닉네임 (2~10자)',
        example: 'test1234',
    })
    @IsNotEmpty()
    @Matches(/^[가-힣a-zA-Z0-9]{2,10}$/)
    nickname: string;

    @ApiProperty({
        type: String,
        description: '프로필 이미지 경로',
        example: 'image/profile/test.jpg',
        required: false,
    })
    @IsOptional()
    @IsString()
    profileImagePath?: string;
}
