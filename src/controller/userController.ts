import { Request, Response } from "express";
import { User } from "../entity/user.entity";
import { updateInfoValidation } from "../validation/user.validation";
import bcryptjs from 'bcryptjs';
import { AppDataSource } from "../../ormconfig";

const userRepository = AppDataSource.getRepository(User);

/**
 * Fetch all users with pagination.
 * @param req - The request object.
 * @param res - The response object.
 */
export const fetchAllUser = async (req: Request, res: Response) => {
    const take = 15;
    const page = parseInt(req.query.page as string || '1');

    try {
        const [data, total] = await userRepository.findAndCount({
            take,
            skip: (page - 1) * take,
            relations: ['role']
        });

        const users = data.map(u => {
            const { password, ...userData } = u;
            return userData;
        });

        const meta = {
            total,
            page,
            last_page: Math.ceil(total / take)
        };

        res.status(200).send({ data: users, meta });
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Create a new user.
 * @param req - The request object.
 * @param res - The response object.
 */
export const createUser = async (req: Request, res: Response) => {
    const { username, email, roleId } = req.body;

    const { error } = updateInfoValidation.validate({ username, email });

    if (error) {
        return res.status(400).send(error.details);
    }

    try {
        const user = await userRepository.save({
            email,
            username,
            password: await bcryptjs.hash("password123", 10),
            role: {
                id: roleId
            }
        });

        const { password, ...userData } = user;
        res.send(userData);
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Update user information.
 * @param req - The request object.
 * @param res - The response object.
 */
export const UpdateUser = async (req: Request, res: Response) => {
    const id: any = req.params.id;
    const { email, username, roleId } = req.body;

    const { error } = updateInfoValidation.validate({ username, email });

    if (error) {
        return res.status(400).send(error.details);
    }

    try {
        await userRepository.update({ id }, {
            email,
            username,
            role: {
                id: roleId
            }
        });

        res.status(200).send({
            message: 'Info updated',
            result: true
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Get a single user by ID.
 * @param req - The request object.
 * @param res - The response object.
 */
export const getOneUser = async (req: Request, res: Response) => {
    const id: any = req.params.id;

    try {
        const user = await userRepository.findOne({ where: { id }, relations: { role: true } });

        res.status(200).send({
            result: user
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Delete a user by ID.
 * @param req - The request object.
 * @param res - The response object.
 */
export const DeleteUser = async (req: Request, res: Response) => {
    const id: any = req.params.id;

    try {
        await userRepository.delete({ id });

        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
};
