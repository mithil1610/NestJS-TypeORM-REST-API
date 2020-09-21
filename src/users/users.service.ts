import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    public async getUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async getUser(_id: number): Promise<User | null> {
        return await this.userRepository.findOneOrFail(_id);
    }
    
    public async registerUser(userData: CreateUserDto): Promise<User> {
        const { email } = userData;
        let user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
        }
        user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }

    public async updateUser(_id: number, updatedUser: UpdateUserDto): Promise<User | null> {
        let user = await this.userRepository.findOneOrFail(_id);
        if (!user.id) {
            console.error("User doesn't exist");
        }
        user = this.userRepository.create(updatedUser);
        return await this.userRepository.save(user);
    }

    public async deleteUser(_id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(_id);
    }
}
