import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
    private users: { userId: number; name: string; email: string }[] = [
        { userId: 1, name: 'John', email: 'john@example.com' },
        { userId: 2, name: 'Jane', email: 'jane@example.com' },
        { userId: 3, name: 'Bob', email: 'bob@example.com' },
    ];

    async getAllUsers(): Promise<any[]> {
        return this.users;
    }

    async getUserById(userId: number): Promise<any> {
        const user = this.users.find(user => user.userId === userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async addUser(name: string, email: string): Promise<any> {
        const newUser = {
            userId: this.users.length + 1,
            name,
            email,
        };
        this.users.push(newUser);
        return newUser;
    }

    async updateUser(userId: number, name: string, email: string): Promise<any> {
        const user = await this.getUserById(userId);
        user.name = name;
        user.email = email;
        return user;
    }

    async deleteUser(userId: number): Promise<void> {
        const userIndex = this.users.findIndex(user => user.userId === userId);
        if (userIndex === -1) {
            throw new NotFoundException('User not found');
        }

        this.users.splice(userIndex, 1);
    }
}
