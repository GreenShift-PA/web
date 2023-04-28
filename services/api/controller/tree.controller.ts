import { Router, Response, Request } from "express"
import * as express from 'express'
import { TreeService } from "../services/tree.service"


export class TreeController {
    readonly path: string
    readonly pool: any

    constructor(pool:any){
        this.path = "/tree"
        this.pool = pool
    }

    getAll = async (req:Request, res: Response)=> {
        const trees = await TreeService.getAll(this.pool)
        if(!trees){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(trees)
    }

    searchTree = async (req:Request<{ id: number}>, res:Response) => {
        const tree = await TreeService.getTreeById(req.params.id, this.pool)
        if(!tree){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(tree)
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.get(`/`, this.getAll.bind(this))
        router.get(`/:id`, this.searchTree.bind(this))
        return router
    }
}