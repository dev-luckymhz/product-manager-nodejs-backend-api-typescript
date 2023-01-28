import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity()
export class Permission {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany( ()=> Role)
    roles : Role[];
}