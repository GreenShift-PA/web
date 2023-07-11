import { Model } from "mongoose"
import { Role, Tree, TreeModel } from "../models"
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
        try{
            const trees = await TreeModel.find({})
            if (!trees){
                res.status(404).json({"message": "No tree"}); return
            }
            res.status(200).json(trees)
        }catch(err){
            res.status(404).json({"message" : "Tree not found"})
            return 
        }
    }

    readonly queryGetOne = {
        "id": "string"
    }
    getOne = async (req: Request, res:Response): Promise<void> => {

        try{
            const tree = await TreeModel.findById(req.query.id)
            if (!tree){
                res.status(404).json({"message": "No tree"}); return
            }
            res.status(200).json(tree)
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