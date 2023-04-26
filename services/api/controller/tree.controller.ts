import { Router, Response, Request } from "express"
import * as express from 'express'


export class TreeController {
    readonly path: string
    readonly pool: any

    constructor(pool:any){
        this.path = "/tree"
        this.pool = pool
    }

    getAll = async (req:Request, res: Response)=> {
        const [trees] = await this.pool.query('SELECT * FROM Tree')
        if(trees.length === 0){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(trees)
    }

    searchTree = async (req:Request<{ id: number}>, res:Response) => {
        const [tree] =  await this.pool.query("SELECT * FROM Tree WHERE ID = ? ", [req.params.id])
        if(tree.length === 0){ 
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