import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Put,
    Query
} from '@nestjs/common';
import {UserService} from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * 유저 정보 가져오기
     * 회원 정보 수정
     * 로그인 상태 체크
     * 비밀번호 변경
     * 회원 탈퇴
     * 로그아웃
     * 이메일 중복 체크
     * 닉네임 중복 체크
     */

    // 유저 정보 가져오기
    @Get(':user_id')
    async getUser(@Param('user_id') userId: string) {
        const parsedUserId = parseInt(userId, 10);

        if (!parsedUserId) {
            throw new BadRequestException('invalid userId');
        }

        const user = await this.userService.getUser(parsedUserId);

        if (!user) {
            throw new NotFoundException('not found user');
        }

        return user;
    }

    // 회원 정보 수정
    @Put(':user_id')
    async updateUser(@Param('user_id') userId: string, @Body() nickname: string, @Body() profileImagePath: string) {
        const parsedUserId = parseInt(userId, 10);

        if (!parsedUserId) {
            throw new BadRequestException('invalid userId');
        }

        if (!nickname) {
            throw new BadRequestException('nickname is required');
        }

        const requestBody = {
            parsedUserId,
            nickname,
            profileImagePath
        }

        const user = await this.userService.updateUser(requestBody);

        if (!user) {
            throw new NotFoundException('not found user');
        }

        return user;
    }

    // 비밀번호 변경
    @Patch(':user_id/password')
    async updatePassword(@Param('user_id') userId: string, @Body('password') password: string) {
        const parsedUserId = parseInt(userId, 10);

        if (!parsedUserId) {
            throw new BadRequestException('invalid userId');
        }

        if (!password) {
            throw new BadRequestException('password is required');
        }

        const requestBody = {
            parsedUserId,
            password
        }

        const user = await this.userService.updatePassword(requestBody);

        if (!user) {
            throw new NotFoundException('not found user');
        }

        return user;
    }

    // 회원 탈퇴
    @Delete(':user_id')
    async softDeleteUser(@Param('user_id') userId: string) {
        const parsedUserId = parseInt(userId, 10);

        if (!parsedUserId) {
            throw new BadRequestException('invalid userId');
        }

        const user = await this.userService.softDeleteUser(parsedUserId);

        if (!user) {
            throw new NotFoundException('not found user');
        }

        return user;
    }

    // 이메일 중복 체크
    @Get('check/email')
    async checkEmail(@Query('email') email: string) {
        if (!email) {
            throw new BadRequestException('email is required');
        }

        return await this.userService.checkEmail(email);
    }

    // 닉네임 중복 체크
    @Get('check/nickname')
    async checkNickname(@Query('nickname') nickname: string) {
        if (!nickname) {
            throw new BadRequestException('nickname is required');
        }

        return await this.userService.checkNickname(nickname);
    }
}
