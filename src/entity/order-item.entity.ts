import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderItem {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    productTitle: string;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @ManyToOne(()=> Order)
    @JoinColumn()
    order : Order;
}