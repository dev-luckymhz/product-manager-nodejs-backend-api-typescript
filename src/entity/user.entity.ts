import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number; // Unique identifier for the user

    @Column({ unique: true })
    email: string; // User's email address

    @Column({ unique: true })
    username: string; // User's username

    @Column()
    password: string; // User's password

    @ManyToOne(() => Role)
    @JoinColumn({ name: "roleId" })
    role: Role; // Role associated with the user

    // No additional methods or functionalities added in this class
}
