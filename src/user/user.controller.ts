import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Put,
    Query
} from '@nestjs/common';
import {UserService} from './user.service';
import {UpdateUserDto} from "./dto/update-user.dto";
import {UpdatePasswordDto} from "./dto/update-password.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * 유저 정보 가져오기
     * 회원 정보 수정
     * 비밀번호 변경
     * 회원 탈퇴
     * 이메일 중복 체크
     * 닉네임 중복 체크
     */

    // 유저 정보 가져오기
    @Get(':user_id')
    async getUserById(@Param('user_id', ParseIntPipe) userId: number) {
        if (!userId) {
            throw new BadRequestException('invalid userId');
        }

        return await this.userService.getUserById(userId);
    }

    // 회원 정보 수정
    @Put(':user_id')
    async updateUser(
        @Param('user_id', ParseIntPipe) userId: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        if (!userId) {
            throw new BadRequestException('invalid userId');
        }

        const requestBody = {
            userId,
            ...updateUserDto,
        }

        return await this.userService.updateUser(requestBody);
    }

    // 비밀번호 변경
    @Patch(':user_id/password')
    async updatePassword(
        @Param('user_id', ParseIntPipe) userId: number,
        @Body() updatePasswordDto: UpdatePasswordDto,
    ) {
        if (!userId) {
            throw new BadRequestException('invalid userId');
        }

        const requestBody = {
            userId,
            ...updatePasswordDto,
        }

        return await this.userService.updatePassword(requestBody);
    }

    // 회원 탈퇴
    @Delete(':user_id')
    @HttpCode(204)
    async softDeleteUser(@Param('user_id', ParseIntPipe) userId: number) {
        if (!userId) {
            throw new BadRequestException('invalid userId');
        }

        return await this.userService.softDeleteUser(userId);
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
