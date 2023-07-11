import * as express from "express"
import { Model } from "mongoose"
import { Role, SessionModel, User, UserModel } from "../models"
import { Router, Response, Request } from "express"
import { SecurityUtils } from "../utils"
import { checkBody, checkUserToken } from "../middleware"

export class AuthController {

    readonly path: string
    readonly model: Model<User>

    constructor(){
        this.path = "/auth"
        this.model = UserModel
    }

    readonly paramsLogin = {
        "login" : "string",
        "password" : "string"
    }

    login = async (req: Request, res: Response): Promise<void> => {

        let user 
        try{
            user = await UserModel.findOne({
                login: req.body.login,
                password: SecurityUtils.toSHA512(req.body.password)
            })
        }catch(err){
            res.status(500).end()
            return
        }
        if (!user){
            res.status(500).end()
            return
        }
        
        // Platform
        const platform = req.headers['user-agent']

        // Token
        const session = await SessionModel.create({
            user: user,
            platform: platform
        })

        res.json({
            token: session._id
        });
    }

    logout = async (req:Request, res:Response): Promise<void> => {
        const session = req.session

        if (!session){
            res.status(401).end(); // unauthorized
            return;
        }

        await SessionModel.deleteOne({_id: session})

        res.status(200).end()
    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.post('/login', express.json(), checkBody(this.paramsLogin), this.login.bind(this))
        router.delete('/logout', checkUserToken(), this.logout.bind(this))
        return router
    }

}