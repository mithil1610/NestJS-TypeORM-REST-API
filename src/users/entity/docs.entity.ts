import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Docs {
    @PrimaryColumn()
    user_id: string;
    
    @Column({length: 5000, nullable: false})
    docsResponse: string;
}
