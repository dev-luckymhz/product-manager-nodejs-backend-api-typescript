import { Request, Response } from "express";

export const Register = (req: Request, res: Response ) => {
    res.send(req.body);
}