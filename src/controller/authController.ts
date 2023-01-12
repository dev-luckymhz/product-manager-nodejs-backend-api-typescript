import { Request, Response } from "express";
import { RegisterValidation } from "../validation/Register";

export const Register = (req: Request, res: Response ) => {
    const body = req.body;

    const {error} = RegisterValidation.validate({
        username: body.username,
        email: body.email,
        password: body.password,
        passwordConf: body.passwordConf
    });
  
    if (error) {
        res.status(400).send(error.details)
    }
    res.send(body);
}