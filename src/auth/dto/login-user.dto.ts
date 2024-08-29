import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
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
        description: '비밀번호',
        example: 'passworD1234!',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
