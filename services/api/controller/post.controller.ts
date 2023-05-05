import { Router, Response, Request } from "express"
import * as express from 'express'
import { UserService } from "../services/user.service"
import { PostService } from "../services/post.service"
import { CommentService } from "../services/comment.service"

export class PostController{

    readonly path: string
    readonly pool: any

    constructor(pool:any){
        this.path = "/post"
        this.pool = pool
    }

    /**
     * @openapi
     * /post/{id}:
     *   get:
     *     tags:
     *       - Post
     *     summary: Get information about a post
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Post ID
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ID:
     *                   type: integer
     *                   default: 0
     *                   example: 6
     *                 user_id:
     *                   type: integer
     *                   default: 0
     *                   example: 1
     *                 tree_id:
     *                   type: integer
     *                   default: 0
     *                   example: 2
     *                 title:
     *                   type: string
     *                   default: ""
     *                   example: "My awesome post"
     *                 description:
     *                   type: string
     *                   default: ""
     *                   example: "This is the description of my awesome post"
     *                 likes:
     *                   type: integer
     *                   default: 0
     *                   example: 10
     *                 is_valid:
     *                   type: integer
     *                   default: 0
     *                   example: 12
     *                 date:
     *                   type: string
     *                   format: date-time
     *                   default: "2023-05-05T00:00:00.000Z"
     *                   example: "2023-05-05T12:34:56.000Z"
     *       404:
     *         description: Not found
     */
    getPost = async (req:Request<{id: number}>, res:Response) => {
        const [post] = await PostService.getPost(req.params.id, this.pool)
        if(!post){ 
            res.status(404).end()
            return 
        }        
        res.status(200).json(post)
    }

    /**
     * @openapi
     * /post:
     *   post:
     *     tags:
     *       - Post
     *     summary: Create a new post
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               user_id:
     *                 type: integer
     *               title:
     *                 type: string
     *               description:
     *                 type: string
     *             required:
     *               - user_id
     *               - title
     *               - description
     *     responses:
     *       201:
     *         description: OK
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: ok
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     */

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

    /**
     * @openapi
     * /post/{id}:
     *   delete:
     *     tags:
     *       - Post
     *     summary: Delete a post
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Post ID
     *         schema:
     *           type: integer
     *     responses:
     *       201:
     *         description: OK
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: OK
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal Server Error
     */
    deletePost = async (req:Request<{id: number}>, res:Response) => {
        // TODO: Check if the user how delete is the same how created the post 

        // Check if the post exist
        if (!await PostService.postExist(req.params.id, this.pool)){
            res.status(400).end()
            return 
        }

        const answer = await PostService.deletePost(req.params.id, this.pool)
        if (answer){
            res.status(201).send("ok")
        }
        res.status(500).end() 
        return 

    }

    /**
     * @openapi
     * /post/{id}/comments:
     *   get:
     *     tags:
     *       - Post
     *     summary: Get all comments associated with a post
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Post ID
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
     *                   post_id:
     *                     type: integer
     *                     example: 2
     *                   user_id:
     *                     type: integer
     *                     example: 3
     *                   description:
     *                     type: string
     *                     example: "This is a comment."
     *                   likes:
     *                     type: integer
     *                     example: 5
     *       406:
     *         description: Not Acceptable
     *       404:
     *         description: Not Found
     */
    getAllComments = async (req:Request<{id: number}>, res:Response) => {
        if (!await PostService.postExist(req.params.id, this.pool)){
            res.status(406).end()
            return 
        }
        const comments = await PostService.getAllComments(req.params.id, this.pool)
        if(!comments){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(comments)
    }

    /**
     * @openapi
     * /post/{id}/validated:
     *   get:
     *     tags:
     *       - Post
     *     summary: Get the number of validations for a post
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Post ID
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: integer
     *               example: 5
     *       406:
     *         description: Not Acceptable
     *       404:
     *         description: Not Found
     */
    getNbrValidated = async (req:Request<{id: number}>, res:Response) => {

        const answer = await PostService.getNbrValidation(req.params.id, this.pool)
        
        res.status(200).send(`${answer}`)
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.get(`/:id`, this.getPost.bind(this))
        router.get(`/:id/comments`, this.getAllComments.bind(this))
        router.get('/:id/validated', this.getNbrValidated.bind(this))
        router.post('/', express.json(), this.newPost.bind(this))
        router.delete('/:id', this.deletePost.bind(this))
        return router
    }

}