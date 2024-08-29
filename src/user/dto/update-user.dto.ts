import { IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({
        type: String,
        description: '닉네임 (2~10자, 한글, 영문, 숫자)',
        example: 'test1234',
    })
    @IsOptional()
    @IsString()
    @Matches(/^[가-힣a-zA-Z0-9]{2,10}$/)
    nickname: string;

    @ApiProperty({
        type: String,
        description: '프로필 이미지 경로',
        example: 'iamge/profile/test.jpg',
    })
    @IsOptional()
    @IsString()
    profileImagePath?: string;
}
