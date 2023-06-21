import { Request, Response } from "express"
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";

export const permissionMiddleware =  (access:string) => {
    return  async (req: Request, res: Response, next : Function) => { 
        const id = req['uId'];
        const repository = getManager().getRepository(User);
        try {
            const user: User = await repository.findOne({ where :{id : id}, relations: ['role', 'role.permissions'] });
            const permission = user.role.permissions;
            if (req.method === 'GET') {
                if(!permission.some(p=> (p.name === `view${access}`) || ( p.name === `edit${access}`))){
                    return res.status(401).send({
                        message: 'unauthorized'
                    })
                }
            } else {
                if(!permission.some(p=> (p.name === `edit${access}`))){
                    return res.status(401).send({
                        message: 'unauthorized'
                    })
                }
            }
            next()
        } catch (error) {
            return res.status(500).send(error);
        }
    }
}