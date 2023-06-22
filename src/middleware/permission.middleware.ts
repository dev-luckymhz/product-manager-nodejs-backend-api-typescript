import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";

/**
 * Middleware for permission-based access control
 * @param access The access level required for the route (e.g., "Product")
 * @returns The middleware function
 */
export const permissionMiddleware = (access: string) => {
    return async (req: Request, res: Response, next: Function) => {
        const id = req['uId']; // Retrieve the user ID from the request object
        const repository = getManager().getRepository(User); // Get the repository for the User entity

        try {
            const user: User = await repository.findOne({
                where: { id: id },
                relations: ['role', 'role.permissions']
            }); // Find the user with the specified ID, including their role and associated permissions

            const permissions = user.role.permissions; // Get the permissions associated with the user's role

            if (req.method === 'GET') {
                // If it's a GET request
                if (!permissions.some(p => p.name === `view${access}` || p.name === `edit${access}`)) {
                    // If the user does not have the required permissions for viewing or editing the resource
                    return res.status(401).send({
                        message: 'unauthorized'
                    });
                }
            } else {
                // If it's not a GET request
                if (!permissions.some(p => p.name === `edit${access}`)) {
                    // If the user does not have the required permissions for editing the resource
                    return res.status(401).send({
                        message: 'unauthorized'
                    });
                }
            }

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            return res.status(500).send(error);
        }
    };
};
