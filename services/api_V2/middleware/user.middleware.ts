import {Request, RequestHandler} from "express";
import {SessionModel, User} from "../models";

declare module 'express' {
    export interface Request {
        user?: User;
        session?: string;
    }
}

export function checkUserToken(): RequestHandler {
    return async function(req: Request, res, next) {
        const authorization = req.headers['authorization'];
        if(authorization === undefined) {
            res.status(401).end(); // unauthorized
            return;
        }
        const parts = authorization.split(' ');
        if(parts.length !== 2 || parts[0] !== 'Bearer') {
            res.status(401).end(); // unauthorized
            return;
        }
        const token = parts[1];
        const session = await SessionModel.findById(token).populate({
            path: "user",
            populate: {
                path: "roles"
            }
        }).exec();
        if(session === null) {
            res.status(401).end(); // unauthorized
            return;
        }
        
        req.user = session.user as User;
        req.session = session._id.toString() as string
        next();
    };
}