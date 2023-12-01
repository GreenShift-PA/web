import {Request, RequestHandler} from "express";
import {SessionModel, User} from "../models";
import { Document } from "mongoose";

declare module 'express' {
    export interface Request {
        user?: (Document<unknown, {}, User> & Omit<User & Required<{_id: string;}>, never>);
        session?: string;
    }
}

export function checkUserToken(): RequestHandler {
    return async function(req: Request, res, next) {
        const authorization = req.headers['authorization'];
        if(authorization === undefined) {
            
            res.status(401).json({"message": "First token invalid"})
            return;
        }
        const parts = authorization.split(' ');
        if(parts.length !== 2 || parts[0] !== 'Bearer') {
            res.status(401).json({"message": "Second token invalid"})
            return;
        }
        const token = parts[1];
        let session
        try{
            session = await SessionModel.findById(token).populate({
                path: "user",
                populate: {
                    path: "roles"
                }
            }).exec();
        }catch(e){
            res.status(400).json({"message": "Authentication token invalid"})
            return 
        }
        if(session === null) {
            res.status(401).end(); // unauthorized
            return;
        }
        
        req.user = session.user as (Document<unknown, {}, User> & Omit<User & Required<{_id: string;}>, never>);
        req.session = session._id.toString() as string
        next();
    };
}