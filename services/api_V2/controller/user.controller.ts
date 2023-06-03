import { Model } from "mongoose"
import { Role, RoleModel, TreeModel, User, UserModel } from "../models"
import { Router, Response, Request} from "express"
import * as express from 'express'
import { SecurityUtils } from "../utils"
import { checkBody, checkUserRole, checkUserToken } from "../middleware"
import { RolesEnums } from "../enums"


export class UserController {

    readonly path: string
    readonly model: Model<User>
    guestRole: Role | null

    constructor(){
        this.path = "/user"
        this.model = UserModel
        this.guestRole = null
    }

    private loadGuestRole = async ():Promise<void> => {
        if (this.guestRole) {
            return
        }
        this.guestRole = await RoleModel.findOne({
            name: "guest"
        }).exec()
    }

    readonly paramsLogin = {
        "login" : "string",
        "password" : "string",
        "tree_name" : "string"
    }

    subscribe = async (req: Request, res: Response):Promise<void> => {

        const login: string = req.body.login
        const password: string  = req.body.password

        try{

            const tree = await TreeModel.create({
                name: req.body.tree_name,
                size : 0
            })

            await this.loadGuestRole()
            const user = await UserModel.create({
                login,
                password: SecurityUtils.toSHA512(password),
                roles:[this.guestRole],
                tree
            })
            res.json(user)

        }catch(err: unknown){
            const me = err as {[key: string]: unknown}
            if (me['name'] === "MongoServerError" && me['code'] === 11000){
                res.status(409).end()
            }else{
                console.log(me)
                res.status(500).end()
            }
        }

    }

    

    me = async (req:Request, res: Response) => {
        res.json(req.user)
    }

    addRole = async (req:Request, res:Response): Promise<void> => {

        if(!req.user){res.send(401).end(); return}

        const newRoles = ["admin", "guest"]

        // Check that we don't assign roles to ourselves 
        if ("6456ba2ab3a5d54d5297eff6" === req.user._id){
            res.status(409).end()
            return
        }

        // TODO: Verify that the user does not already have the role
        
        for (let role of newRoles){
            const ModelOfRole = await RoleModel.findOne({ name: role }).exec();
            
            // Insertion
            await UserModel.updateOne(
                { _id: "6456ba2ab3a5d54d5297eff6" },  
                { $push: { roles: ModelOfRole } } 
            );
      
        }
        res.status(200).end()
        return 
    }

    getRoles = async (req: Request, res: Response): Promise<void> => {

        const roles = await RoleModel.find()

        res.send(roles)
    }

    getAllUsers = async (req:Request, res: Response): Promise<void> => {
        const users = (await UserModel.find({})).length

        res.status(200).json(users)
    }

    getOneUser = async (req: Request, res: Response): Promise<void> => {
        if(!req.query.id || typeof req.query.id !== "string"){
            res.status(400).end()
            return
        }

        const user = await UserModel.findById(req.query.id).populate("roles").populate("tree")

        res.status(200).json(user)
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.post(`/subscribe`, express.json(), checkBody(this.paramsLogin), this.subscribe.bind(this))
        // router.patch('/role', express.json(), checkUserToken(), checkUserRole('admin'), this.addRole.bind(this))
        router.get('/me', checkUserToken(), this.me.bind(this))
        router.get('/count', checkUserToken(), checkUserRole(RolesEnums.admin), this.getAllUsers.bind(this))
        router.get('/one', checkUserToken(), checkUserRole(RolesEnums.guest), this.getOneUser.bind(this))
        router.get('/role', checkUserToken(), checkUserRole(RolesEnums.admin), this.getRoles.bind(this)) // Return the list of all possible roles 

        return router
    }
}