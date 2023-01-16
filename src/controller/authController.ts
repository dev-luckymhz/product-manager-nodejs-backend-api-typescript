import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import { RegisterValidation } from "../validation/Register";
import bcryptjs from 'bcryptjs';
import { sign } from "jsonwebtoken";

export const Register = async (req: Request, res: Response ) => {
    const body = req.body;

    const {error} = RegisterValidation.validate({
        username: body.username,
        email: body.email,
        password: body.password,
        passwordConf: body.passwordConf
    });
  
    if (error) {
        return res.status(400).send(error.details)
    }
    const repository = getManager().getRepository(User);
    await repository.save({
        email: body.email,
        username: body.username,
        password: await bcryptjs.hash(body.password, 10)
        }).then((result) => {
            const {password , ...user} = result;
            return res.send(user);
        }).catch((err) => {
            return res.status(500).send(err);
        });
};

export const Login = async (req: Request, res: Response) => {
// const { email, passwords, rememberMe } = req.body;
// const email :string = req.body.email;
    const repository = getManager().getRepository(User);
    await  repository.findOneBy({email : req.body.email}).then( async (result) => {
        if (!result) {
            // throw new Error("userNotFound");
            return res.status(404).send({
                message : "user not found"
            })
        }        
        if (!await bcryptjs.compare(req.body.password, result.password)) {
            // throw new Error("passwordError");
            return res.status(500).send({
                message : "Password incorrect"
            })
        }
        const payload = {
            id: result.id,
            email: result.email
        };
        const token = sign( payload , "secret zo")
        return res.status(200).send({
            token : token,
            message : "Loged in"
        })
    }).catch(async (err) => {
        return res.status(500).send(err);
    });

}