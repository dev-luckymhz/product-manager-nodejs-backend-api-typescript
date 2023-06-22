import { Request, Response } from "express";
import { Parser } from "json2csv";
import { getManager } from "typeorm";
import { OrderItem } from "../entity/order-item.entity";
import { Order } from "../entity/order.entity";
import { AppDataSource } from "../../ormconfig";

const repository = AppDataSource.getRepository(Order);

/**
 * Fetches all orders with pagination.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @returns The paginated list of orders.
 */
export const fetchAllOrder = async (req: Request, res: Response) => {
    try {
        const take = 15;
        const page = parseInt(req.query.page as string || '1');
        const [data, total] = await repository.findAndCount({
            take,
            skip: (page - 1) * take,
            relations: ['order_items'],
        });

        const formattedData = data.map((order: Order) => ({
            id: order.id,
            name: order.name,
            email: order.email,
            total: order.total,
            created_at: order.created_at,
            order_items: order.order_items,
        }));

        return res.status(200).send({
            data: formattedData,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / take),
            },
        });
    } catch (err) {
        return res.status(500).send(err);
    }
};

/**
 * Exports orders to CSV format.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 */
export const ExportToCsv = async (req: Request, res: Response) => {
    const parser = new Parser({
        fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity'],
    });
    const json = [];
    try {
        const orders = await repository.find({ relations: ['order_items'] });

        orders.forEach((order: Order) => {
            json.push({
                ID: order.id,
                Name: order.name,
                Email: order.email,
                'Product Title': '',
                Price: '',
                Quantity: '',
            });

            order.order_items.forEach((orderItem: OrderItem) => {
                json.push({
                    ID: '',
                    Name: '',
                    Email: '',
                    'Product Title': orderItem.productTitle,
                    Price: orderItem.price,
                    Quantity: orderItem.quantity,
                });
            });
        });

        const csv = parser.parse(json);
        res.header('Content-Type', 'text/csv');
        res.attachment('order.csv');
        return res.send(csv);
    } catch (error) {
        return res.status(500).send(error);
    }
};

/**
 * Retrieves the chart data for orders.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @returns The chart data for orders.
 */
export const Chart = async (req: Request, res: Response) => {
    const manager = getManager();
    const query =
        'SELECT DATE_FORMAT(o.created_at, "%Y-%m-%d") AS date, SUM(oi.price * oi.quantity) AS sum FROM `order` o JOIN order_item oi ON o.id = oi.orderId GROUP BY date';
    try {
        const result = await manager.query(query);
        return res.send(result);
    } catch (error) {
        return res.status(500).send(error);
    }
};
