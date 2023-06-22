import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number; // Unique identifier for the order item

    @Column()
    productTitle: string; // Title of the product in the order item

    @Column()
    price: number; // Price of the product in the order item

    @Column()
    quantity: number; // Quantity of the product in the order item

    @ManyToOne(() => Order)
    @JoinColumn()
    order: Order; // Order associated with the order item

    // No additional methods or functionalities added in this class
}
