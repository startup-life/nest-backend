import { Controller, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async loginUser(@Body() loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        if (!email) {
            throw new BadRequestException('이메일을 입력해주세요.');
        }

        if (!password) {
            throw new BadRequestException('비밀번호를 입력해주세요.');
        }

        const user = await this.authService.loginUser(email, password);

        if (!user) {
            throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
        }

        return user;
    }
}
