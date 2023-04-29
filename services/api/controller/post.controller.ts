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

    newPost = async (req:Request, res:Response) => {
        res.status(418).send('Pas encore fait, va prendre un café')
    }

    deletePost = async (req:Request<{id: number}>, res:Response) => {
        res.status(418).send('Pas encore fait, va prendre un café')
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.get(`/:id`, this.getPost.bind(this))
        router.post('/', express.json(), this.newPost.bind(this))
        router.delete('/:id', this.deletePost.bind(this))
        return router
    }

}