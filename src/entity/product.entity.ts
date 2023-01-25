import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:String;

    @Column()
    description: String;

    @Column()
    image: String;

    @Column()
    price: Number;
}