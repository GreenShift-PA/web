import { Request, RequestHandler } from "express";

export function checkQuery(params: Record<string, string>): RequestHandler{
    return async (req: Request, res, next) => {

        for (let param of Object.keys(params)){
            let type = params[param]

            if (!(param in req.query )&& !type.includes('undefined')){
                res.status(400).end()
                return
            }
               
        }
    
        next()


    }
}