import { Router, Response, Request } from "express"
import * as express from 'express'
import { UserService } from "../services/user.service"
import { TreeService } from "../services/tree.service"
import { PostService } from "../services/post.service"


export class UserController {

    readonly path: string
    readonly pool: any

    constructor(pool:any){
        this.path = "/user"
        this.pool = pool
    }

    getAll = async (req:Request, res: Response)=> {
        const users = await UserService.getAllUsers(this.pool)
        if(!users){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(users)
    }

    searchUser = async (req: Request<{ id: number}>, res: Response) => {
        const user = await UserService.getUser(req.params.id, this.pool)
        if(!user){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(user)
    }

    deleteUser = async (req:Request<{ id: number}>, res: Response) => {
        if (!await UserService.isUser(req.params.id, this.pool)){
            res.status(406).end()
            return 
        }

        // Suppression of the user's tree 
        const [user_tree] = await UserService.getUserTreeInfo(req.params.id, this.pool)
        
        if (!user_tree){
            res.status(404).end()
            return 
        }
        const dead_tree = await TreeService.killTree(parseInt(user_tree.ID, 10), this.pool)
        
        // If the tree has been killed
        if (dead_tree){
            // Suppression of the user 
            const answer = await UserService.deleteUserById(req.params.id, this.pool)
            
            if (answer){
                res.status(202).send("ok")
            }
        }

        res.status(404).end()
        return 
    }

    createUser = async (req:Request, res: Response) => {
        if (!req.body || !req.body.name || !req.body.firstname || !req.body.email || !req.body.phone || !req.body.country){
            // If there is not all the parameters
            res.status(400).end()
            return 
        }
        if(typeof req.body.name !== 'string' || typeof req.body.firstname !== 'string' || typeof req.body.email !== 'string' || typeof req.body.phone !== 'string' || typeof req.body.country !== 'string'){
            // If the types are not the correct one
            res.status(400).end()
            return
        }
        const answer = await UserService.createUser(req.body.name, req.body.firstname, req.body.email, req.body.phone, req.body.country, this.pool)

        if (answer){
            res.status(202).send("ok")
        }
        
        res.status(404).end()
        return 
    }

    getUserTree = async (req:Request<{id: number}>,  res: Response) => {
        if (!await UserService.isUser(req.params.id, this.pool)){
            res.status(406).end()
            return 
        }
        const user_tree = await UserService.getUserTreeInfo(req.params.id, this.pool)

        if (!user_tree){
            res.status(400).end()
            return 
        }
        res.status(200).json(user_tree)
    }

    getUserPosts = async (req:Request<{ id: number}>, res:Response)=> {
        if (!await UserService.isUser(req.params.id, this.pool)){
            res.status(406).end()
            return 
        }
        const posts = await UserService.getAllPosts(req.params.id, this.pool)
        if(!posts){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(posts)
    }

    getAllComments = async (req:Request<{ id: number}>, res:Response)=> {
        if (!await UserService.isUser(req.params.id, this.pool)){
            res.status(406).end()
            return 
        }
        const comments = await UserService.getAllComments(req.params.id, this.pool)
        if(!comments){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(comments)

    }

    validatePost = async (req:Request<{user_id: number, post_id:number}>, res:Response) => {

        // Check if the user and the post exist
        if (!await UserService.isUser(req.params.user_id, this.pool)){
            res.status(406).end()
            return 
        }

        if (!await PostService.postExist(req.params.post_id, this.pool)){
            res.status(400).end()
            return 
        }

        // Check that the user who validates is not the same one who created the post 
        if  (await UserService.isYourPost(req.params.user_id, req.params.post_id, this.pool)){
            res.status(500).end()
            return 
        }

        // Check that the user has not already validated the post 
        if (!await UserService.isItValidated(req.params.user_id, req.params.post_id, this.pool)){
            const answer = UserService.validatePost(req.params.user_id, req.params.post_id, this.pool)
            if(!answer){ 
                res.status(404).end()
                return 
            }
            res.status(200).send("ok")
        }
        res.status(409).end()

    }

    likePost = async (req:Request<{user_id: number, post_id: number}>, res:Response) => {
        res.status(410).send("It's not done yet, you can go have a coffee while waiting")
 
    }

    getNbrValidated = async (req:Request<{id: number}>, res:Response) => {
        
        if (!await UserService.isUser(req.params.id, this.pool)){
            res.status(406).end()
            return 
        }

        const listValidated = await UserService.getAllValidation(req.params.id, this.pool)

        if(!listValidated){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(listValidated)
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.get(`/`, this.getAll.bind(this))
        router.get(`/:id`, this.searchUser.bind(this))
        router.get(`/:id/tree`, this.getUserTree.bind(this))
        router.get('/:id/posts', this.getUserPosts.bind(this))
        router.get(`/:id/comments`, this.getAllComments.bind(this))
        router.get('/:id/validated', this.getNbrValidated.bind(this))
        router.delete(`/:id`, this.deleteUser.bind(this))
        router.post(`/`,express.json(), this.createUser.bind(this))
        router.post('/:user_id/valid/:post_id', this.validatePost.bind(this))
        router.post('/:user_id/like/:post_id', this.likePost.bind(this))
        return router
    }
}