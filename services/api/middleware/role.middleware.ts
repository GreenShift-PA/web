import { RequestHandler, Request, Response } from "express";
import { RolesEnums } from "../enums";

export function checkUserRole(name: RolesEnums ): RequestHandler{
    return async function (req:Request, res: Response, next): Promise<void> {
        if (!req.user){
            res.status(401).end()
            return 
        }

        const user = req.user

        for (let role of user.roles){

            if(typeof role === 'object' && role.name === name){
                next()
                return
            }
        }
        res.status(403).end()
    }
}