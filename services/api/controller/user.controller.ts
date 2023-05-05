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

    /**
     * @openapi
     * /user:
     *  get:
     *     tags:
     *     - User
     *     description: Responds with a list of all users
     *     responses:
     *       200:
     *         description: List of users
     *       404:
     *         description: Not found
     */
    getAll = async (req:Request, res: Response)=> {
        const users = await UserService.getAllUsers(this.pool)
        if(!users){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(users)
    }

    /**
     * @openapi
     * '/user/{id}':
     *  get:
     *     tags:
     *     - User
     *     summary: Get user by ID
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the user to get
     *         schema:
     *           type: string
     *     responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                ID:
     *                  type: number
     *                  example: 123
     *                name:
     *                  type: string
     *                  example: "John"
     *                firstname:
     *                  type: string
     *                  example: "Doe"
     *                email:
     *                  type: string
     *                  example: "john.doe@example.com"
     *                phone:
     *                  type: string
     *                  default: "0658590324"
     *                country:
     *                  type: string
     *                  default: "France"
     *                registration:
     *                  type: string
     *                  default: "2023-05-03T14:53:39.000Z"
     *      404:
     *        description: Not found
     */
    searchUser = async (req: Request<{ id: number}>, res: Response) => {
        const [user] = await UserService.getUser(req.params.id, this.pool)
        if(!user){ 
            res.status(404).end()
            return 
        }
        
        res.status(200).json(user)
    }

    /**
     * @openapi
     * '/user/{id}':
     *  delete:
     *     tags:
     *     - User
     *     summary: Delete user by ID
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the user to get
     *         schema:
     *           type: string
     *     responses:
     *      202:
     *        description: Accepted
     *      400:
     *        description: Bad request
     *      500:
     *        description: Internal Server error
     */
    deleteUser = async (req:Request<{ id: number}>, res: Response) => {
        if (!await UserService.isUser(req.params.id, this.pool)){
            res.status(400).end()
            return 
        }

        // Suppression of the user's tree 
        const [user_tree] = await UserService.getUserTreeInfo(req.params.id, this.pool)
        
        if (!user_tree){
            res.status(500).end()
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

        res.status(500).end()
        return 
    }

    /**
     * @openapi
     * '/user':
     *  post:
     *     tags:
     *     - User
     *     summary: Register a user
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              name:
     *                type: string
     *                default: "John"
     *              firstname:
     *                type: string
     *                default: "Doe"
     *              email:
     *                type: string
     *                default: "john.doe@example.com"
     *              phone:
     *                 type: string
     *                 default: "0658590324"
     *              country:
     *                 type: string
     *                 default: "France"
     *     responses:
     *      202:
     *        description: Success
     *        content:
     *          text/plain:
     *            schema:
     *              type: string
     *              example: ok
     *      400:
     *        description: Bad request
     *      404:
     *        description: Not found
     */
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

    /**
     * @openapi
     * '/user/{id}/tree':
     *  get:
     *     tags:
     *     - User
     *     summary: Get user's tree info
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the user
     *         schema:
     *           type: string
     *     responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                ID:
     *                  type: number
     *                  example: 13
     *                user_id:
     *                  type: number
     *                  example: 153
     *                size:
     *                  type: number
     *                  example: 14
     *      400:
     *        description: Bad request
     *      500:
     *        description: Internal Server error
     */
    getUserTree = async (req:Request<{id: number}>,  res: Response) => {
        if (!await UserService.isUser(req.params.id, this.pool)){
            res.status(400).end()
            return 
        }
        const [user_tree] = await UserService.getUserTreeInfo(req.params.id, this.pool)

        if (!user_tree){
            res.status(500).end()
            return 
        }
        res.status(200).json(user_tree)
    }

    /**
     * @openapi
     * '/user/{id}/posts':
     *  get:
     *     tags:
     *     - User
     *     summary: Get all user's posts
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID of the user
     *         schema:
     *           type: string
     *     responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              type: array
     *              items:
     *                type: object
     *                properties:
     *                  ID:
     *                    type: integer
     *                  user_id:
     *                    type: integer
     *                  tree_id:
     *                    type: integer
     *                  title:
     *                    type: string
     *                  description:
     *                    type: string
     *                  likes:
     *                    type: integer
     *                  is_valid:
     *                    type: integer
     *                  date:
     *                    type: string
     *                    format: date-time
     *            example:
     *              - ID: 3
     *                user_id: 2
     *                tree_id: 2
     *                title: Test avec PostMan
     *                description: C'est un post fait avec postman pour verifier que la creation est ok
     *                likes: 0
     *                is_valid: 0
     *                date: '2023-05-04T17:05:11.000Z'
     *              - ID: 1
     *                user_id: 2
     *                tree_id: 2
     *                title: Mon premier Post sur GreenShift
     *                description: Bienvenue a tous
     *                likes: 2
     *                is_valid: 2
     *                date: '2023-05-03T14:53:39.000Z'
     *      400:
     *        description: Bad request
     *      404:
     *        description: Not found
     */
    getUserPosts = async (req:Request<{ id: number}>, res:Response)=> {
        if (!await UserService.isUser(req.params.id, this.pool)){
            res.status(400).end()
            return 
        }
        const [posts] = await UserService.getAllPosts(req.params.id, this.pool)
        if(!posts){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(posts)
    }

    /**
     * @openapi
     * /user/{id}/comments:
     *   get:
     *     tags:
     *       - User
     *     summary: Get all comments made by a user
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: The ID of the user
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *          application/json:
     *            schema:
     *              type: array
     *              items:
     *                type: object
     *                properties:
     *                  ID:
     *                    type: integer
     *                  user_id:
     *                    type: integer
     *                  post_id:
     *                    type: integer
     *                  description:
     *                    type: string
     *                  likes:
     *            example:
     *              - ID: 3
     *                user_id: 2
     *                post_id: 1
     *                description: Bienvenue a toi
     *                likes: 3
     *              - ID: 1
     *                user_id: 2
     *                post_id: 2
     *                description: Bien et toi
     *                likes: 12
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     */
    getAllComments = async (req:Request<{ id: number}>, res:Response)=> {
        if (!await UserService.isUser(req.params.id, this.pool)){
            res.status(400).end()
            return 
        }
        const comments = await UserService.getAllComments(req.params.id, this.pool)
        if(!comments){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(comments)

    }

    /**
     * @openapi
     * /user/{user_id}/valid/{post_id}:
     *   post:
     *     tags:
     *     - User
     *     summary: Validate a post from another user
     *     parameters:
     *       - name: user_id
     *         in: path
     *         required: true
     *         description: ID of the validating user
     *         schema:
     *           type: integer
     *       - name: post_id
     *         in: path
     *         required: true
     *         description: ID of the post to validate
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: OK
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     */

    validatePost = async (req:Request<{user_id: number, post_id:number}>, res:Response) => {
        // Check if the user and the post exist
        if (!await UserService.isUser(req.params.user_id, this.pool)){
            res.status(400).end()
            return 
        }

        if (!await PostService.postExist(req.params.post_id, this.pool)){
            res.status(400).end()
            return 
        }

        // Check that the user who validates is not the same one who created the post 
        if  (await UserService.isYourPost(req.params.user_id, req.params.post_id, this.pool)){
            res.status(403).end()
            return 
        }

        // Check that the user has not already validated the post 
        if (!await UserService.isItValidated(req.params.user_id, req.params.post_id, this.pool)){
            const answer = UserService.validatePost(req.params.user_id, req.params.post_id, this.pool)
            if(!answer){ 
                res.status(403).end()
                return 
            }
            res.status(200).send("ok")
        }
        res.status(409).end()

    }

    /**
     * @openapi
     * '/user/{user_id}/like/{post_id}':
     *   post:
     *     tags:
     *       - User
     *     summary: Like a post
     *     parameters:
     *       - in: path
     *         name: user_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the user who likes the post
     *       - in: path
     *         name: post_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the post being liked
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: OK
     *       400:
     *         description: Bad request
     *       409:
     *         description: Conflict, the user has already liked the post
     *       403:
     *         description: Forbidden, the user cannot like their own post
     */
    likePost = async (req:Request<{user_id: number, post_id: number}>, res:Response) => {
        
        // Check if the user and the post exist
        if (!await UserService.isUser(req.params.user_id, this.pool)){
            res.status(400).end()
            return 
        }

        if (!await PostService.postExist(req.params.post_id, this.pool)){
            res.status(400).end()
            return 
        }

        // Check that the user has not already validated the post 
        if (!await UserService.isItLikeed(req.params.user_id, req.params.post_id, this.pool)){
            const answer = UserService.likePost(req.params.user_id, req.params.post_id, this.pool)
            if(!answer){ 
                res.status(403).end()
                return 
            }
            res.status(200).send("ok")
        }
        res.status(409).end()
 
    }

    /**
     * @openapi
     * /user/{id}/validated:
     *   get:
     *     tags:
     *       - User
     *     summary: Return a list of validated posts
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: User ID
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   ID:
     *                     type: integer
     *                     example: 1
     *                   user_id:
     *                     type: integer
     *                     example: 2
     *                   post_id:
     *                     type: integer
     *                     example: 3
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     */

    getNbrValidated = async (req:Request<{id: number}>, res:Response) => {
        
        if (!await UserService.isUser(req.params.id, this.pool)){
            res.status(400).end()
            return 
        }

        const [listValidated] = await UserService.getAllValidation(req.params.id, this.pool)

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