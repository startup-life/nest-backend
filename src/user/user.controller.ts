import {Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getUsers() {
        const users = await this.userService.getAllUsers();
        return users;
    }

    @Get(':user_id')
    async getUser(@Param('user_id', ParseIntPipe) userId: number) {
        const user = await this.userService.getUserById(userId);
        return user;
    }

    @Post()
    async addUser(@Body() body: { name: string; email: string }) {
        const newUser = await this.userService.addUser(body.name, body.email);
        return newUser;
    }

    @Put(':user_id')
    async updateUser(
        @Param('user_id', ParseIntPipe) userId: number,
        @Body() body: { name: string; email: string },
    ) {
        const updatedUser = await this.userService.updateUser(userId, body.name, body.email);
        return updatedUser;
    }

    @Delete(':user_id')
    @HttpCode(204)
    async deleteUser(@Param('user_id', ParseIntPipe) userId: number) {
        await this.userService.deleteUser(userId);
        return null; // DELETE 요청이므로 성공 시 본문이 없음을 의미하는 null 반환
    }
}
