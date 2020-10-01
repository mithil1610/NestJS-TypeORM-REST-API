import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { UserRO } from "../ro/user.ro";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({length: 45, nullable: false})
    name: string;

    @Column({length: 50, unique: true, nullable: false})
    email: string;
    
    @Column({length: 180, nullable: false})
    password: string;
    
    @Column({length: 10, nullable: true})
    phoneno: string;
    
    @Column({length: 500, nullable: true})
    address: string;

    @Column({length: 180, nullable: true})
    profile_photo: string;

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password);
    }
    
    toResponseObject(): UserRO {
        const { id, name, email } = this;
        const responseObject: UserRO = {
            id,
            name,
            email,
        };
        return responseObject;
    }
}
