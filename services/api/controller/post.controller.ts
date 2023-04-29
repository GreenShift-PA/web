import { Router, Response, Request } from "express"
import * as express from 'express'
import { UserService } from "../services/user.service"
import { PostService } from "../services/post.service"

export class PostController{

    readonly path: string
    readonly pool: any

    constructor(pool:any){
        this.path = "/post"
        this.pool = pool
    }

    getPost = async (req:Request<{id: number}>, res:Response) => {
        const post = await PostService.getPost(req.params.id, this.pool)
        if(!post){ 
            res.status(404).end()
            return 
        }        
        res.status(200).json(post)
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.get(`/:id`, this.getPost.bind(this))
        return router
    }

}