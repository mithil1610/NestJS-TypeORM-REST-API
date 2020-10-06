import { Controller, Get, Post, Body, Param, Put, Delete, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { UserRO } from './ro/user.ro';
import { UsersService } from './users.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './utils/file-upload.utils';
import { Docs } from './entity/docs.entity';

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
    
    @Post()
    @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true, skipMissingProperties: true }))
    registerUser(@Body() user: CreateUserDto): Promise<UserRO> {
        return this.usersService.registerUser(user);
    }
    
    @Put(':id')
    @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true, skipMissingProperties: true }))
    @UseInterceptors(
        FileInterceptor('profile_photo', {
            storage: diskStorage({
                destination: './public/uploads/profile_photos',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async updateUser(@UploadedFile() profile_photo, @Param('id') id: string, @Body() user: UpdateUserDto): Promise<User | null> {
        if (profile_photo !== undefined) {
            return this.usersService.updateUser(id, user, profile_photo.path);
        }
        return this.usersService.updateUser(id, user, null);
    }
    
    @Delete(':id')
    deleteUser(@Param('id') id: string): Promise<DeleteResult> {
        return this.usersService.deleteUser(id);
    }

    @Post('upload-docs/:id')
    @UseInterceptors(
        FilesInterceptor('image', 20, {
            storage: diskStorage({
                destination: './public/uploads/user_docs',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadMultipleFiles(@UploadedFiles() files: any[], @Param('id') id: string): Promise<Docs | null> {
        const response = [];
        files.forEach(file => {
            const fileResponse = {
                filename: file.filename,
                path: file.path,
            };
            response.push(fileResponse);
        });
        const response1 = JSON.stringify(response);
        return this.usersService.uploadDocs(id, response1);
    }
}
