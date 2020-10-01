import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, Not } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Docs } from './entity/docs.entity';
import { User } from './entity/user.entity';
import { UserRO } from './ro/user.ro';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, @InjectRepository(Docs) private readonly docsRepository: Repository<Docs>) { }

    public async getUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async getUser(_id: string): Promise<UserRO | null> {
        const user = await this.userRepository.findOne(_id);
        if (!user) {
            throw new HttpException("User doesn't exist", HttpStatus.BAD_REQUEST);
        }

        return (await this.userRepository.findOneOrFail(_id)).toResponseObject();
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

    public async updateUser(_id: string, updatedUser: UpdateUserDto, profile_photo_path: string): Promise<User | null> {
        let user = await this.userRepository.findOne(_id);
        if (!user) {
            throw new HttpException("User doesn't exist", HttpStatus.BAD_REQUEST);
        }

        const { email } = updatedUser;
        user = await this.userRepository.findOne({ where: { email: email, id: Not(_id) } });
        if (user) {
            throw new HttpException("Email ID already exists", HttpStatus.BAD_REQUEST);
        }

        updatedUser.id = _id;
        updatedUser.profile_photo = profile_photo_path;
        user = this.userRepository.create(updatedUser);
        return await this.userRepository.save(user);
    }

    public async deleteUser(_id: string): Promise<DeleteResult> {
        const user = await this.userRepository.findOne(_id);
        if (!user) {
            throw new HttpException("User doesn't exist", HttpStatus.BAD_REQUEST);
        }
        
        return await this.userRepository.delete(_id);
    }
    
    public async uploadDocs(_id: string, docsResponse) {
        const user = await this.userRepository.findOne(_id);
        if (!user) {
            throw new HttpException("User doesn't exist", HttpStatus.BAD_REQUEST);
        }

        const docs = this.docsRepository.create();
        docs.user_id = _id;
        docs.docsResponse = docsResponse;
        return await this.docsRepository.save(docs);
    }
}
