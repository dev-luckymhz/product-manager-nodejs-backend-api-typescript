import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Product } from "../entity/product.entity";


export const fetchAllProduct = async (req: Request, res: Response ) => { 
    const take = 15;
    const page = parseInt( req.query.page as string || '1');
    const repository = getManager().getRepository(Product);
    await repository.findAndCount({
        take,
        skip: (page - 1 ) * take
    }).then((result) => {
        const [data, total] = result;
        return res.status(200).send({
            data,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / take)
            }
        })
    }).catch((err) => {
        return res.status(500).send(err);
    });
};

export const createProduct = async (req: Request, res: Response ) => {
    const {title, description, image, price} = req.body;

        const repository = getManager().getRepository(Product);
        await repository.save({
            title: title,
            description: description,
            image: image,
            price: price
            }).then((result) => {
                return res.send(result);
            }).catch((err) => {
                return res.status(500).send(err);
            });
    };


    export const UpdateProduct = async (req: Request, res: Response) => {
        const id = req.params.id;
        const {title, description, image, price} = req.body;

        const repository = getManager().getRepository(Product);
        await repository.update( {id: parseInt(id)}, {
            title: title,
            description: description,
            image: image,
            price: price
            }).then((result) => {
            return res.status(200).send({
                message: 'Info updated',
                result
            });
        }).catch((err) => {
            return res.status(500).send(err);
        });
    };
    
    export const getOneProduct = async (req: Request, res: Response) => {
        const id = req.params.id;
        const repository = getManager().getRepository(Product);
        await repository.findOne({ where :{id : parseInt(id)} }).then((result) => {
            return res.status(200).send({            
                result
            });
        }).catch((err) => {
            return res.status(500).send(err);
        });
    };

    export const DeleteProduct = async (req: Request, res: Response ) => { 
        const id = req.params.id;
        const repository = getManager().getRepository(Product);
        await repository.delete({id : parseInt(id)}).then((result) => {
            return res.status(200).send(result)
        }).catch((err) => {
            return res.status(500).send(err);
        });
    }

