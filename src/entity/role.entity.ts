import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission.entity";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number; // Unique identifier for the role

    @Column()
    name: string; // Name of the role

    @ManyToMany(() => Permission)
    @JoinTable({
        joinColumn: { name: 'roleId', referencedColumnName: 'id' }, // Join column configuration
        inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' } // Inverse join column configuration
    })
    permissions: Permission[]; // Permissions associated with the role

    // No additional methods or functionalities added in this class
}
