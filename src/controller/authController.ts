import { Request, Response } from "express";
import { AppDataSource } from "../../ormconfig";
import { User } from "../entity/user.entity";
import { RegisterValidation, updateInfoValidation, updatePasswordValidation } from "../validation/user.validation";
import bcryptjs from "bcryptjs";
import { sign } from "jsonwebtoken";

/**
 * Registers a new user.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @returns The registered user.
 */
export const Register = async (req: Request, res: Response) => {
    const body = req.body;

    const { error } = RegisterValidation.validate({
        username: body.username,
        email: body.email,
        password: body.password,
        passwordConf: body.confirmPassword,
    });

    if (error) {
        return res.status(400).send(error.details);
    }

    const repository = AppDataSource.getRepository(User);

    try {
        const result = await repository.save({
            email: body.email,
            username: body.username,
            password: await bcryptjs.hash(body.password, 10),
        });

        const { password, ...user } = result;

        return res.send(user);
    } catch (err) {
        return res.status(500).send(err);
    }
};

/**
 * Authenticates a user and generates a JWT token.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @returns The generated JWT token.
 */
export const Login = async (req: Request, res: Response) => {
    const email: string = req.body.username;
    const password: string = req.body.password;

    if (!email) {
        return res.status(400).send({
            message: "Veuillez entrer un email",
        });
    }

    const repository = AppDataSource.getRepository(User);

    try {
        const result = await repository.findOneBy([{ email: email }, { username: email }]);

        if (!result || !Object.keys(result).length) {
            return res.status(404).send({
                message: "User not found",
            });
        }

        if (!(await bcryptjs.compare(password, result.password))) {
            return res.status(400).send({
                message: "Password incorrect",
            });
        }

        const payload = {
            id: result.id,
            email: result.email,
        };

        const token = sign(payload, process.env.SECRETE_TOKEN);

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(200).send({
            message: "Logged in",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
};

/**
 * Retrieves the authenticated user's information.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @returns The authenticated user's information.
 */
export const authenticatedUser = async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(User);

        const result = await repository.findOneBy({ id: req["uId"] });

        if (!result) {
            return res.status(401).send({
                message: "An error occurred",
            });
        }

        const { password, ...user } = result;

        return res.status(200).send({
            user,
        });
    } catch (error) {
        return res.status(401).send({
            message: "Unauthenticated",
            error,
        });
    }
};

/**
 * Updates the user's information.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @returns The result of the update operation.
 */
export const UpdateInfo = async (req: Request, res: Response) => {
    const id = req["uId"];
    const { email, username } = req.body;

    const { error } = updateInfoValidation.validate({
        username: username,
        email: email,
    });

    if (error) {
        return res.status(400).send(error.details);
    }

    const repository = AppDataSource.getRepository(User);

    try {
        const result = await repository.update({ id: id }, {
            email: email,
            username: username,
        });

        return res.status(200).send({
            message: "Info updated",
            result,
        });
    } catch (err) {
        return res.status(500).send(err);
    }
};

/**
 * Updates the user's password.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @returns The result of the update operation.
 */
export const UpdatePassword = async (req: Request, res: Response) => {
    const id = req["uId"];
    let user;

    const { oldPass, newpass, passwordConf } = req.body;

    const { error } = updatePasswordValidation.validate({
        newpass: newpass,
        passwordConf: passwordConf,
    });

    if (error) {
        return res.status(400).send(error.details);
    }

    const repository = AppDataSource.getRepository(User);

    try {
        user = await repository.findOneBy({ id: id });

        if (!user) {
            return res.status(401).send({
                message: "An error occurred",
            });
        }

        if (!(await bcryptjs.compare(oldPass, user.password))) {
            return res.status(500).send({
                message: "Password incorrect",
            });
        }

        await repository.update({ id: id }, {
            password: await bcryptjs.hash(newpass, 10),
        });

        return res.status(200).send({
            message: "Info updated",
        });
    } catch (err) {
        return res.status(500).send(err);
    }
};

/**
 * Logs out the user by clearing the JWT cookie.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @returns A logout message.
 */
export const Logout = async (req: Request, res: Response) => {
    res.clearCookie("jwt");
    res.status(200).send({
        message: "Logout",
    });
};
