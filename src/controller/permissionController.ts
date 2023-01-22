import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Permission } from "../entity/permission.entity";

export const fetchPermission = async (req: Request, res: Response ) => { 
    const repository = getManager().getRepository(Permission);
    await repository.find().then((result) => {
        return res.status(200).send(result)
    }).catch((err) => {
        return res.status(500).send(err);
    });
};