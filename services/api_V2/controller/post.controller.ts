import { Model } from "mongoose"
import { Post, PostModel } from "../models/post.model"
import * as express from "express"
import { Router, Response, Request } from "express"
import { checkBody, checkUserRole, checkUserToken } from "../middleware"
import { RolesEnums } from "../enums"
import { checkQuery } from "../middleware/query.middleware"
import { UserModel } from "../models"

export class PostController {

    readonly path: string
    readonly model: Model<Post>


    constructor(){
        this.path = "/post"
        this.model = PostModel
    }

    readonly paramsNewPost = {
        "title" : "string",
        "description" : "string",
    }

    newPost = async (req: Request, res: Response): Promise<void> => {

        const newPost = await PostModel.create({
            title: req.body.title,
            description: req.body.description,
            like: []
        })

        try{
            req.user?.posts.push(newPost)
            req.user?.save()
            
        }catch(err){
            res.status(500).end()
            return 
        }
        
        res.status(201).json(newPost)
        return 
    }

    readonly queryPostId = {
        "id" : "string"
    }

    getOnePost = async (req:Request, res:Response): Promise<void> => {
        
        try{
            const post = await PostModel.findById(req.query.id)
            if (!post){
                res.status(404).end()
                return 
            }
            res.status(200).json(post)
        }catch(err){
            res.status(500).end()
            return
        }
    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', checkUserToken(), checkUserRole(RolesEnums.guest), checkQuery(this.queryPostId), this.getOnePost.bind(this))
        router.post('/', express.json(), checkUserToken(), checkUserRole(RolesEnums.guest), checkBody(this.paramsNewPost), this.newPost.bind(this))

        return router
    }
}