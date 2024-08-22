import {Controller, Post, Body, BadRequestException, UnauthorizedException, Get, Query} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationUtil } from '../common/util/validation.util';
import {LoginUserDto} from "./dto/login-user.dto";
import {SignUpUserDto} from "./dto/sign-up-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * 로그인
     * 회원가입
     */

    // 로그인
    @Post('login')
    async loginUser(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.loginUser(loginUserDto);
    }

    // 회원가입
    @Post('signup')
    async signUpUser(@Body() signUpUserDto: SignUpUserDto) {
        return await this.authService.signUpUser(signUpUserDto);
    }
}
