import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Role } from "../entity/role.entity";


export const fetchRole = async (req: Request, res: Response ) => { 
    const repository = getManager().getRepository(Role);
    await repository.find().then((result) => {
        return res.status(200).send(result)
    }).catch((err) => {
        return res.status(500).send(err);
    });
};

export const createRole = async (req: Request, res: Response ) => {
    const {name, permissions} = req.body;
    const repository = getManager().getRepository(Role);
    await repository.save({
        name: name,
        permissions: permissions.map(id => ({id}))
        }).then((result) => {
            return res.send(result);
        }).catch((err) => {
            return res.status(500).send(err);
        });
};

export const getOneRole = async (req: Request, res: Response) => {
    const id = req.params.id;
    const repository = getManager().getRepository(Role);
    await repository.findOne({ where :{id : parseInt(id)}, relations: { permissions: true} }).then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        return res.status(500).send(err);
    });
};

export const UpdateRole = async (req: Request, res: Response) => {
    const id = req.params.id;
    const {name, permissions} = req.body;

    const repository = getManager().getRepository(Role);

    await repository.update( {id: parseInt(id)}, {
        name: name,
        permissions: permissions.map(id => ({id}))
        }).then((result) => {
        return res.status(200).send({
            message: 'Info updated',
            result
        });
    }).catch((err) => {
        return res.status(500).send(err);
    });
};

export const DeleteRole = async (req: Request, res: Response ) => { 
    const id = req.params.id;
    const repository = getManager().getRepository(Role);
    await repository.delete({id : parseInt(id)}).then((result) => {
        return res.status(200).send(result)
    }).catch((err) => {
        return res.status(500).send(err);
    });
}