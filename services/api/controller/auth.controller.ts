import * as express from "express"
import { Model } from "mongoose"
import { Role, SessionModel, User, UserModel } from "../models"
import { Router, Response, Request } from "express"
import { SecurityUtils } from "../utils"
import { checkBody, checkUserToken } from "../middleware"
import { checkQuery } from "../middleware/query.middleware"

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
            res.status(400).end()
            return
        }
        if (!user){
            res.status(401).end()
            return
        }

        // Platform
        const platform = req.headers['user-agent']

        try{
            const is_user_last_session = await SessionModel.findOneAndDelete({
                user: user?._id,
                platform: platform
            })
        }catch(e){
            res.status(500).end()
            return 
        }


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

    readonly queryIsTokenUp = {
        "token" : "string"
    }

    isTokenUp = async (req:Request, res:Response): Promise<void> => {

        try{
            const session = await SessionModel.findById(req.query.token)
            if (!session){
                res.status(404).json({"message" : "This session is not usable"})
                return 
            }


            res.status(200).json({"message" : "The token is OK"})
            return 
        }catch(e){
            res.status(404).json({"message" : "This session is not usable"})
            return 
        }     

    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/check',checkQuery(this.queryIsTokenUp), this.isTokenUp.bind(this))
        router.post('/login', express.json(), checkBody(this.paramsLogin), this.login.bind(this))
        router.delete('/logout', checkUserToken(), this.logout.bind(this))
        return router
    }

}