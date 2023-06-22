import { Request, Response } from "express";
import { Product } from "../entity/product.entity";
import { AppDataSource } from "../../ormconfig";

const repository = AppDataSource.getRepository(Product);

/**
 * Fetch all products with pagination.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with product data and pagination metadata
 */
export const fetchAllProduct = async (req: Request, res: Response ) => {
    const take = 15; // Number of products to retrieve per page
    const page = parseInt(req.query.page as string || '1'); // Current page number

    try {
        const [data, total] = await repository.findAndCount({
            take,
            skip: (page - 1) * take
        });

        const response = {
            data,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / take)
            }
        };

        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send(err);
    }
};

/**
 * Create a new product.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with the created product
 */
export const createProduct = async (req: Request, res: Response ) => {
    const { title, description, image, price } = req.body;

    try {
        const result = await repository.save({
            title,
            description,
            image,
            price
        });

        return res.send(result);
    } catch (err) {
        return res.status(500).send(err);
    }
};

/**
 * Update a product by ID.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with a success message and the updated product
 */
export const UpdateProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { title, description, image, price } = req.body;

    try {
        const result = await repository.update({ id: parseInt(id) }, {
            title,
            description,
            image,
            price
        });

        return res.status(200).send({
            message: 'Info updated',
            result
        });
    } catch (err) {
        return res.status(500).send(err);
    }
};

/**
 * Get a product by ID.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with the requested product
 */
export const getOneProduct = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const result = await repository.findOne({ where: { id: parseInt(id) } });

        return res.status(200).send({
            result
        });
    } catch (err) {
        return res.status(500).send(err);
    }
};

/**
 * Delete a product by ID.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with the result of the deletion operation
 */
export const DeleteProduct = async (req: Request, res: Response ) => {
    const id = req.params.id;

    try {
        const result = await repository.delete({ id: parseInt(id) });

        return res.status(200).send(result);
    } catch (err) {
        return res.status(500).send(err);
    }
};
