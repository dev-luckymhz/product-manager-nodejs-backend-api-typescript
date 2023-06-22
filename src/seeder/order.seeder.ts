import { createConnection, getManager } from "typeorm";
import faker from "faker";
import { randomInt } from "crypto";
import { Order } from "../entity/order.entity";
import { OrderItem } from "../entity/order-item.entity";

// Establish a database connection
createConnection().then(async (result) => {
    const OrderRepository = getManager().getRepository(Order); // Get the repository for the Order entity
    const OrderItemRepository = getManager().getRepository(OrderItem); // Get the repository for the OrderItem entity

    for (let i = 0; i < 30; i++) {
        // Create a new order with random data using faker library
        const order = await OrderRepository.save({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
        });

        // Generate a random number of order items for each order
        for (let j = 0; j < randomInt(1, 5); j++) {
            // Create a new order item with random data
            await OrderItemRepository.save({
                order,
                productTitle: faker.lorem.words(2),
                price: randomInt(100, 150),
                quantity: randomInt(1, 5),
            });
        }
    }

    process.exit(0); // Exit the script once the data generation is complete
});
