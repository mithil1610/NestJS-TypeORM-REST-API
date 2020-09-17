import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }

    async getUser(_id: number): Promise<User> {
        return await this.usersRepository.findOne({ id: _id });
    }
    
    async getUsers(): Promise<User[]> {
        return await this.usersRepository.find({});
    }

    async createUser(user: User): Promise<InsertResult> {
        return await this.usersRepository.insert(user);
    }

    async updateUser(_id: number, user: User): Promise<UpdateResult> {
        return await this.usersRepository.update(_id, user);
    }

    async deleteUser(_id: number): Promise<DeleteResult> {
        return await this.usersRepository.delete(_id);
    }
}
