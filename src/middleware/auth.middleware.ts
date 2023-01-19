import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";

export const authMiddleware = async (req: Request, res: Response, next : Function) => {
    try {
        const jwt = req.cookies['jwt'];
        const payload: any = verify(jwt, process.env.SECRETE_TOKEN)
        if (!payload) {
            return res.status(401).send({
                message: "unauthenticated"
            })
        }
        req['uId'] = payload.id;
        next();
    } catch (error) {
        return res.status(401).send({
                message: "unauthenticated"
        })  
    }    
}