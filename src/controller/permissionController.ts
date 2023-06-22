import { Request, Response } from "express";
import { Permission } from "../entity/permission.entity";
import { AppDataSource } from "../../ormconfig";

const repository = AppDataSource.getRepository(Permission);

/**
 * Fetches all permissions.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @returns The list of permissions.
 */
export const fetchPermission = async (req: Request, res: Response) => {
    try {
        const permissions = await repository.find();
        return res.status(200).send(permissions);
    } catch (err) {
        return res.status(500).send(err);
    }
};
