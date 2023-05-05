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

    /**
     * @openapi
     * /tree:
     *   get:
     *     tags:
     *       - Tree
     *     summary: Return the list of all trees
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   user_id:
     *                     type: integer
     *                     example: 2
     *                   post_id:
     *                     type: integer
     *                     example: 3
     *                   size:
     *                     type: integer
     *                     example: 10
     *       404:
     *         description: Not found
     */

    getAll = async (req:Request, res: Response)=> {
        const trees = await TreeService.getAll(this.pool)
        if(!trees){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(trees)
    }

    /**
     * @openapi
     * /tree/{id}:
     *   get:
     *     tags:
     *       - Tree
     *     summary: Return information about a tree
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the tree to retrieve
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user_id:
     *                   type: integer
     *                   example: 1
     *                 post_id:
     *                   type: integer
     *                   example: 2
     *                 size:
     *                   type: integer
     *                   example: 10
     *       404:
     *         description: Not found
     */

    searchTree = async (req:Request<{ id: number}>, res:Response) => {
        const [tree] = await TreeService.getTreeById(req.params.id, this.pool)
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