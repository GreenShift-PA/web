import { Model } from "mongoose"
import { Post, PostModel } from "../models/post.model"
import * as express from "express"
import { Router, Response, Request } from "express"
import { checkBody, checkUserRole, checkUserToken } from "../middleware"
import { RolesEnums } from "../enums"
import { checkQuery } from "../middleware/query.middleware"

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
        res.status(501).json({"message": "The functionality is not finished, you can go and get a coffee while you wait."})
    }

    readonly queryPostId = {
        "id" : "string"
    }

    getOnePost = async (req:Request, res:Response): Promise<void> => {
        res.status(501).json({"message": "The functionality is not finished, you can go and get a coffee while you wait."})
    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', checkUserToken(), checkUserRole(RolesEnums.guest), checkQuery(this.queryPostId), this.getOnePost.bind(this))
        router.post('/', express.json(), checkUserToken(), checkUserRole(RolesEnums.guest), checkBody(this.paramsNewPost), this.newPost.bind(this))

        return router
    }
}