import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Role } from "../entity/role.entity";
import { AppDataSource } from "../../ormconfig";

const roleRepository = AppDataSource.getRepository(Role);

/**
 * Fetch all roles.
 * @param req - The request object.
 * @param res - The response object.
 */
export const fetchRole = async (req: Request, res: Response) => {
    try {
        const roles = await roleRepository.find();
        res.status(200).send(roles);
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Create a new role.
 * @param req - The request object.
 * @param res - The response object.
 */
export const createRole = async (req: Request, res: Response) => {
    const { name, permissions } = req.body;

    try {
        const role = await roleRepository.save({
            name,
            permissions: permissions.map(id => ({ id }))
        });

        res.send(role);
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Get a single role by ID.
 * @param req - The request object.
 * @param res - The response object.
 */
export const getOneRole = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const role = await roleRepository.findOne({
            where: { id },
            relations: { permissions: true }
        });

        res.status(200).send(role);
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * Update role information.
 * @param req - The request object.
 * @param res - The response object.
 */
export const UpdateRole = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { name, permissions } = req.body;

    try {
        await roleRepository.update({ id }, {
            name,
            permissions: permissions.map(id => ({ id }))
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
 * Delete a role by ID.
 * @param req - The request object.
 * @param res - The response object.
 */
export const DeleteRole = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        await roleRepository.delete({ id });
        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
};
