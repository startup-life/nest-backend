import {Controller, Post, Body, Get, UseGuards, Request, HttpCode} from '@nestjs/common';
import { AuthService } from './auth.service';
import {LoginUserDto} from "./dto/login-user.dto";
import {SignUpUserDto} from "./dto/sign-up-user.dto";
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * 로그인
     * 회원가입
     * 로그인 상태 확인
     * 로그아웃
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

    // 로그인 상태 확인
    @UseGuards(AuthGuard('jwt'))
    @Get('check')
    async checkAuth(@Request() request: any) {
        return request.user;
    }
}
