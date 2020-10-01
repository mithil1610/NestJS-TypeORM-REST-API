import { Column, Entity } from "typeorm";

@Entity()
export class Docs {
    @Column()
    id: string;
    
    @Column({length: 500, nullable: false})
    docPath: string;
}