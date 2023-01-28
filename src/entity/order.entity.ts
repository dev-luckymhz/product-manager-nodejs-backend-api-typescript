import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    lastName: string
    
    @Column()
    firstName: string

    @Column()
    email: string

    @CreateDateColumn()
    created_at: string

    @OneToMany(() => OrderItem, orderItems => orderItems.order)
    order_items : OrderItem[]
}