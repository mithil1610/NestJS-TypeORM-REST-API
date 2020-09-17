import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

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
}
