import { Model } from "mongoose"
import { Role, Tree, TreeModel, UserModel } from "../models"
import * as express from 'express'
import { Router, Response, Request} from 'express'
import { checkUserToken } from "../middleware"
import { checkQuery } from "../middleware/query.middleware"

export class TreeController {

    readonly path: string
    readonly model: Model<Tree>

    constructor(){
        this.path = "/tree"
        this.model = TreeModel
    }

    getAllTrees = async (req: Request, res:Response): Promise<void> => {
        // try{
        //     const trees = await TreeModel.find({})
        //     if (!trees){
        //         res.status(404).json({"message": "No tree"}); return
        //     }
        //     res.status(200).json(trees)
        // }catch(err){
        //     res.status(404).json({"message" : "Tree not found"})
        //     return 
        // }
    
        const user_tree:any[] = []
        try{
            const users = await UserModel.find().populate("tree")
            if(!users){
                res.status(500).json({"message": "This error will nether appear"})
                return
            }
            for (let user of users){
                const tree = user.tree
                user_tree.push({tree, user})
            }

            res.status(200).json(user_tree).end()
            return 

        }catch(e){
            console.log(e);
            res.status(404).end()
            return 
            
        }
    }

    readonly queryGetOne = {
        "id": "string"
    }
    getOne = async (req: Request, res:Response): Promise<void> => {

        try{
            const tree = await TreeModel.findById(req.query.id)
            const user = await UserModel.findOne({
                tree: req.query.id
            })
            if (!tree || !user){
                res.status(404).json({"message": "No tree"}); return
            }
            user.password = ""
            res.status(200).json({ tree, user })
        }catch(err){
            res.status(404).json({"message" : "Tree not found"})
            return 
        }

    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/all', checkUserToken(), this.getAllTrees.bind(this))
        router.get('/', checkUserToken(), checkQuery(this.queryGetOne), this.getOne.bind(this))
        return router
    }

}