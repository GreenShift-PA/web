import { Document, Model } from "mongoose"
import { Post, PostModel } from "../models/post.model"
import * as express from "express"
import { Router, Response, Request } from "express"
import { checkBody, checkUserRole, checkUserToken } from "../middleware"
import { RolesEnums } from "../enums"
import { checkQuery } from "../middleware/query.middleware"
import { CommentModel, UserModel } from "../models"

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
            like: [],
            comments: []
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
            const post = await PostModel.findById(req.query.id).populate({
                path: "comments"
            })
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

    readonly paramsComment = {
        "id_post" : "string",
        "description": "string"
    }

    addComment = async (req: Request, res: Response): Promise<void> => {

        let post : (Document<unknown, {}, Post> & Omit<Post & Required<{_id: string;}>, never>) | null  

        try{
            post = await PostModel.findById(req.body.id_post)
            if(!post){
                res.status(404).json({"message": "Post not found"})
            }
        }catch(err){
            res.status(500).end()
            return
        }

        const newComment = await CommentModel.create({
            description: req.body.description,
            author: req.user
        })

        post?.comments.push(newComment)
        post?.save()

        res.status(201).json(newComment)
        return

    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', checkUserToken(), checkUserRole(RolesEnums.guest), checkQuery(this.queryPostId), this.getOnePost.bind(this))
        router.post('/', express.json(), checkUserToken(), checkUserRole(RolesEnums.guest), checkBody(this.paramsNewPost), this.newPost.bind(this))
        router.post('/comment', express.json(), checkUserToken(), checkBody(this.paramsComment), this.addComment.bind(this))

        return router
    }
}