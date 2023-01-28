import { Request, Response } from "express";

export const UploadImage = async (req: Request, res: Response ) => { 
    return res.send({
        url : `http://localhost:8000/api/upload/${req.file.filename}`
    })
}