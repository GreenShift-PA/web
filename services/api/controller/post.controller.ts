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

        if (!req.body || !req.body.user_id || !req.body.title || !req.body.description){
            // If there is not all the parameters
            res.status(400).end()
            return 
        }

        if(typeof req.body.user_id !== 'number' || typeof req.body.title !== 'string' || typeof req.body.description !== 'string'){
            // If the types are not the correct one
            res.status(400).end()
            return
        }

        if (!await UserService.isUser(req.body.user_id, this.pool)){
            // If user do not existe
            res.status(400).end()
            return
        }

        const answer = await PostService.newPost(req.body.user_id, req.body.title, req.body.description, this.pool)
        if (answer){
            res.status(201).send("ok")
        }
        res.status(500).end() 
        return 
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