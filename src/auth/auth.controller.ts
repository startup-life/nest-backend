import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
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
    @ApiBody({ type: LoginUserDto, description: '로그인 요청 데이터' })
    @ApiOkResponse({
        description: '로그인 성공',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'integer' },
                email: { type: 'string' },
                nickname: { type: 'string' },
                fileId: { type: 'integer' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                deletedAt: { type: 'string', nullable: true },
                profileImagePath: { type: 'string' },
                accessToken: { type: 'string' },
            },
        },
    })
    @ApiBadRequestResponse({ description: '잘못된 이메일 또는 비밀번호' })
    @ApiUnauthorizedResponse({ description: '로그인 실패' })
    async loginUser(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.loginUser(loginUserDto);
    }

    // 회원가입
    @Post('signup')
    @ApiBody({ type: SignUpUserDto, description: '회원가입 요청 데이터' })
    @ApiCreatedResponse({
        description: '회원가입 성공',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'integer' },
                email: { type: 'string' },
                nickname: { type: 'string' },
                fileId: { type: 'integer' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                deletedAt: { type: 'string', nullable: true },
            },
        },
    })
    @ApiBadRequestResponse({ description: '이미 존재하는 이메일 또는 닉네임' })
    @ApiInternalServerErrorResponse({ description: '회원가입 실패' })
    async signUpUser(@Body() signUpUserDto: SignUpUserDto) {
        return await this.authService.signUpUser(signUpUserDto);
    }

    // 로그인 상태 확인
    @UseGuards(AuthGuard('jwt'))
    @Get('check')
    @ApiBearerAuth()
    @ApiOkResponse({
        description: '로그인 상태 확인 성공',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'integer' },
                email: { type: 'string' },
                nickname: { type: 'string' },
                fileId: { type: 'integer' },
                sessionId: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                deletedAt: { type: 'string', nullable: true },
                profileImagePath: { type: 'string' },
            },
        },
    })
    @ApiUnauthorizedResponse({ description: '로그인 상태 확인 실패' })
    async checkAuth(@Request() request: any) {
        return request.user;
    }
}
