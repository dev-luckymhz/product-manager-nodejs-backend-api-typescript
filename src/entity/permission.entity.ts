import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number; // Unique identifier for the permission

    @Column()
    name: string; // Name of the permission

    @ManyToMany(() => Role)
    @JoinTable() // Join table used for the many-to-many relationship
    roles: Role[]; // Roles associated with the permission

    // No additional methods or functionalities added in this class
}
