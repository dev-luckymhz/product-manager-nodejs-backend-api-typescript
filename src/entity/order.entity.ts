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
    order_items : OrderItem[];

    public get name() : string {
        return `${this.firstName} ${this.lastName}`
    }

    
    public get total() : number {
        return this.order_items.reduce((sum: number , item: OrderItem)=> sum + item.quantity * item.price, 0)
    }
    
    
}