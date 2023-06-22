import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number; // Unique identifier for the product

    @Column()
    title: string; // Title of the product

    @Column()
    description: string; // Description of the product

    @Column()
    image: string; // Image URL or path of the product

    @Column()
    price: number; // Price of the product

    // No additional methods or functionalities added in this class
}
