import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    
    @Get()
    getUsers(): Promise<User[]> {
        return this.usersService.getUsers();
    }
    
    @Get(':id')
    getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.getUser(id);
    }
    
    @Post()
    createUser(@Body() user: CreateUserDto): Promise<any> {
        return this.usersService.createUser(user);
    }
    
    @Put(':id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: CreateUserDto): Promise<any> {
        return this.usersService.updateUser(id, user);
    }
    
    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.usersService.deleteUser(id);
    }
}
