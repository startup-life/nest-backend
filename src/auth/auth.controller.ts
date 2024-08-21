import {Controller, Post, Body, BadRequestException, UnauthorizedException, Get, Query} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationUtil } from '../common/util/validation.util';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * 로그인
     * 회원가입
     * 로그인 상태 체크
     */

    // 로그인
    @Post('login')
    async loginUser(@Body('email') email: string, @Body('password') password: string) {

        if (!email) {
            throw new BadRequestException('이메일을 입력해주세요.');
        }

        if (!password) {
            throw new BadRequestException('비밀번호를 입력해주세요.');
        }

        return await this.authService.loginUser(email, password);
    }

    // 회원가입
    @Post('signup')
    async signUpUser(
        @Body('email') email: string,
        @Body('password') password: string,
        @Body('nickname') nickname: string,
        @Body('profileImagePath') profileImagePath?: string
    ) {
        if (!profileImagePath) {
            profileImagePath = null;
        }

        if (!email || !ValidationUtil.validEmail(email)) {
            throw new BadRequestException('이메일을 입력해주세요.');
        }

        if (!password || !ValidationUtil.validPassword(password)) {
            throw new BadRequestException('비밀번호를 입력해주세요.');
        }

        if (!nickname || !ValidationUtil.validNickname(nickname)) {
            throw new BadRequestException('이름을 입력해주세요.');
        }

        const requestBody = {
            email,
            password,
            nickname,
            profileImagePath,
        }

        return await this.authService.signUpUser(requestBody);
    }
}
