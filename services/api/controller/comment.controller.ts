import { Router, Response, Request } from "express"
import * as express from 'express'

export class CommentController {

    readonly path: string
    readonly pool: any

    constructor(pool:any){
        this.path = "/comment"
        this.pool = pool
    }

    // TODO: Get all user's comment ( make it into UserController )

    // TODO: Get all Post's comment ( male it into PostController )

    getComment = async (req:Request<{id: number}>, res:Response) => {

        res.status(418).send('Its not ready, go make a café')
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.get(`/:id`,this.getComment.bind(this))
        return router
    }

}