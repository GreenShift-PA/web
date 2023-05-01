import { Router, Response, Request } from "express"
import * as express from 'express'
import { CommentService } from "../services/comment.service"

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

        const comment = await CommentService.getComment(req.params.id, this.pool)
        if(!comment){ 
            res.status(404).end()
            return 
        }        
        res.status(200).json(comment)
    }

    deleteComment = async (req:Request<{id: number}>, res:Response) => {
        // TODO: Check if the user how delete is the same how created the comment or the on how make the original post

        if (!await CommentService.getComment(req.params.id, this.pool)){
            res.status(400).end()
            return 
        }
        const answer = await CommentService.deleteComment(req.params.id, this.pool)

        if (answer){
            res.status(201).send("ok")
        }
        res.status(500).end() 
        return 
    }



    buildRouter = (): Router => {
        const router = express.Router()
        router.get(`/:id`,this.getComment.bind(this))
        router.delete(`/:id`, this.deleteComment.bind(this))
        return router
    }

}