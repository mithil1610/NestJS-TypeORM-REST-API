import { Controller, Get, Post, Body, Param, Put, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { UserRO } from './ro/user.ro';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    
    @Get()
    getUsers(): Promise<User[]> {
        return this.usersService.getUsers();
    }
    
    @Get(':id')
    getUser(@Param('id') id: string): Promise<UserRO | null> {
        return this.usersService.getUser(id);
    }
    
    @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true, skipMissingProperties: true }))
    @Post()
    registerUser(@Body() user: CreateUserDto): Promise<UserRO> {
        return this.usersService.registerUser(user);
    }
    
    @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true, skipMissingProperties: true }))
    @Put(':id')
    updateUser(@Param('id') id: string, @Body() user: UpdateUserDto): Promise<User | null> {
        return this.usersService.updateUser(id, user);
    }
    
    @Delete(':id')
    deleteUser(@Param('id') id: string): Promise<DeleteResult> {
        return this.usersService.deleteUser(id);
    }
}
