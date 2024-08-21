import {Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getUsers(): Promise<any[]> {
        return await this.userService.getAllUsers();
    }

    @Get(':user_id')
    async getUser(@Param('user_id', ParseIntPipe) userId: number): Promise<any> {
        return await this.userService.getUserById(userId);
    }

    @Post()
    async addUser(@Body() body: { name: string; email: string }): Promise<any> {
        return await this.userService.addUser(body.name, body.email);
    }

    @Put(':user_id')
    async updateUser(
        @Param('user_id', ParseIntPipe) userId: number,
        @Body() body: { name: string; email: string },
    ): Promise<any> {
        return await this.userService.updateUser(userId, body.name, body.email);
    }

    @Delete(':user_id')
    @HttpCode(204)
    async deleteUser(@Param('user_id', ParseIntPipe) userId: number): Promise<void> {
        return await this.userService.deleteUser(userId);
    }
}
