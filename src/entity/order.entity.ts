import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number; // Unique identifier for the order

    @Column()
    lastName: string; // Last name of the customer

    @Column()
    firstName: string; // First name of the customer

    @Column()
    email: string; // Email of the customer

    @CreateDateColumn()
    created_at: string; // Timestamp indicating when the order was created

    @OneToMany(() => OrderItem, orderItems => orderItems.order)
    order_items: OrderItem[]; // Array of order items associated with the order

    /**
     * Retrieves the full name of the customer.
     *
     * @returns The full name of the customer.
     */
    public get name(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    /**
     * Calculates the total price of the order.
     *
     * @returns The total price of the order.
     */
    public get total(): number {
        return this.order_items.reduce((sum: number, item: OrderItem) => sum + item.quantity * item.price, 0);
    }
}
