import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, Not } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { UserRO } from './ro/user.ro';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    public async getUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async getUser(_id: string): Promise<UserRO | null> {
        return await (await this.userRepository.findOneOrFail(_id)).toResponseObject();
    }
    
    public async registerUser(userData: CreateUserDto): Promise<UserRO> {
        const { email } = userData;
        let user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
        }
        user = this.userRepository.create(userData);
        await this.userRepository.save(user);
        return user.toResponseObject();
    }

    public async updateUser(_id: string, updatedUser: UpdateUserDto): Promise<User | null> {
        let user = await this.userRepository.findOne(_id);
        if (!user) {
            throw new HttpException("User doesn't exist", HttpStatus.BAD_REQUEST);
        }

        const { email } = updatedUser;
        user = await this.userRepository.findOne({ where: { email: email, id: Not(_id) } });
        if (user) {
            throw new HttpException("Email ID already exists", HttpStatus.BAD_REQUEST);
        }

        user = await this.userRepository.findOne(_id);
        if (await bcrypt.compare(updatedUser.password, user.password) || updatedUser.password === user.password) {
            updatedUser.password = user.password;
        }
        else {
            updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
        }

        updatedUser.id = _id;
        user = this.userRepository.create(updatedUser);
        return await this.userRepository.save(user);
    }

    public async deleteUser(_id: string): Promise<DeleteResult> {
        return await this.userRepository.delete(_id);
    }
}
