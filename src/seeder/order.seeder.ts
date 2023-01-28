import { createConnection, getManager } from "typeorm";
import faker from "faker";
import { randomInt } from "crypto";
import { Order } from "../entity/order.entity";
import { OrderItem } from "../entity/order-item.entity";

createConnection().then(async (result) => { 
    const OrderRepository = getManager().getRepository(Order);
    const OrderItemRepository = getManager().getRepository(OrderItem);
    for (let i = 0; i < 30; i++) {
        const order = await OrderRepository.save({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
        })
        for (let j = 0; j < randomInt(1,5); j++) {
          await OrderItemRepository.save({
            order,
            productTitle: faker.lorem.words(2),
            price: randomInt(100, 150),
            quantity: randomInt(1,5),
          })
        }
    }
    process.exit(0)
});