import { Request, Response } from "express";
import { AppDataSource } from '../../ormconfig';
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import { RegisterValidation, updateInfoValidation, updatePasswordValidation } from "../validation/user.validation";
import bcryptjs from 'bcryptjs';
import { sign } from "jsonwebtoken";

export const Register = async (req: Request, res: Response ) => {
const body = req.body;

    const {error} = RegisterValidation.validate({
        username: body.username,
        email: body.email,
        password: body.password,
        passwordConf: body.confirmPassword
    });
  
    if (error) {
        return res.status(400).send(error.details)
    }
    const repository = AppDataSource.getRepository(User);
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
    const email :string = req.body.username;
    const password :string = req.body.password;
    if (!email) {
        return res.status(400).send({
            message : " veuiller entrer un email"
        })
    }
    const repository = getManager().getRepository(User);
    await  repository.findOneBy([{email : email},{ username: email }]).then( async (result) => {
        if (!result || !Object.keys(result).length) {
            // throw new Error("userNotFound");
            // console.log("user not found")
            return res.status(404).send({
                message : "user not found"
            })
        }        
        if (!await bcryptjs.compare(password, result.password)) {
            // throw new Error("passwordError");
            return res.status(400).send({
                message : "Password incorrect"
            })
        }
        const payload = {
            id: result.id,
            email: result.email
        };
        const token = sign( payload , process.env.SECRETE_TOKEN)


        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 26 * 60 * 1000 // 1 days 
        })


        return res.status(200).send({
            message : "Logged in"
        })
        
    }).catch( (err) => {
        console.log(err)
        return res.status(500).send(err);
    });
};

export const authenticatedUser = async (req: Request, res: Response) => {
    try {
        const repository = getManager().getRepository(User);
        await  repository.findOneBy({id : req['uId']})
        .then( async (result) => { 
            if (!result) {
                return res.status(401).send({
                    message: "an error occured"
                })
            }
            const {password, ...user } = result;
            return res.status(200).send({
                user
            })
        })
        .catch(async (err) => {
            return res.status(500).send(err);
        });        
    } catch (error) {
        return res.status(401).send({
            message: "unauthenticated",
            error
        })
    }

};


export const UpdateInfo = async (req: Request, res: Response) => {
    const id = req['uId'];
    const {email, username} = req.body;

    const {error} = updateInfoValidation.validate({
        username: username,
        email: email
});

if (error) {
    return res.status(400).send(error.details)
}
    const repository = getManager().getRepository(User);
    repository.update({id: id}, {
        email: email,
        username: username
    }).then((result) => {
        return res.status(200).send({
            message: 'Info updated',
            result
        });
    }).catch((err) => {
        return res.status(500).send(err);
    });
}
export const UpdatePassword = async (req: Request, res: Response) => {
    const id = req['uId'];
    let user ;
    const {oldPass, newpass, passwordConf} = req.body;

        const {error} = updatePasswordValidation.validate({
            newpass: newpass,
            passwordConf: passwordConf
    });
  
    if (error) {
        return res.status(400).send(error.details)
    }
    const repository = getManager().getRepository(User);
    try {
        user = await repository.findOneBy({id : id});
    } catch (err) {
        return res.send(err)
    }
    if (!user) {
        return res.status(401).send({
            message: "an error occured"
        })
    }
    if (!await bcryptjs.compare(user.password, oldPass)) {
        // throw new Error("passwordError");
        return res.status(500).send({
            message : "Password incorrect"
        })
    }
    await repository.update({id: id}, {
        password: await bcryptjs.hash(newpass, 10)
    }).then((result) => {
        return res.status(200).send({
            message: 'Info updated',
            result
        });
    }).catch((err) => {
        return res.status(500).send(err);
    });
}

export const Logout = async (req: Request, res: Response) => {
    res.clearCookie('jwt');
    res.status(200).send({
        message: 'logout'
    });
}