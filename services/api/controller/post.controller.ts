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

    getUserPost = async (req:Request<{ id: number}>, res:Response)=> {
        if (!await UserService.isUser(req.params.id, this.pool)){
            res.status(406).end()
            return 
        }
        const posts = await PostService.getAllPosts(req.params.id, this.pool)
        if(!posts){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(posts)
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/:id', this.getUserPost.bind(this))
        return router
    }

}