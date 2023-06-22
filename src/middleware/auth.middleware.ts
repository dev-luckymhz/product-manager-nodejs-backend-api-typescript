import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

/**
 * Middleware for authentication
 * @param req The Express Request object
 * @param res The Express Response object
 * @param next The next middleware function
 */
export const authMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        const jwt = req.cookies['jwt']; // Extract the JWT token from the request cookies
        const payload: any = verify(jwt, process.env.SECRETE_TOKEN); // Verify and decode the JWT token using the secret token

        if (!payload) {
            // If the token is not valid or expired, return an unauthenticated response
            return res.status(401).send({
                message: "unauthenticated"
            });
        }

        req['uId'] = payload.id; // Attach the user ID from the token payload to the request object for further use
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // If an error occurs during token verification or decoding, return an unauthenticated response
        return res.status(401).send({
            message: "unauthenticated"
        });
    }
};
