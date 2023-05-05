import { Router, Response, Request } from "express"
import * as express from 'express'
import { CommentService } from "../services/comment.service"

export class CommentController {

    readonly path: string
    readonly pool: any

    constructor(pool:any){
        this.path = "/comment"
        this.pool = pool
    }


    /**
     * @openapi
     * /comment/{id}:
     *   get:
     *     tags:
     *       - Comment
     *     summary: Get information about a comment
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Comment ID
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
     *                   example: 1
     *                 post_id:
     *                   type: integer
     *                   example: 2
     *                 user_id:
     *                   type: integer
     *                   example: 3
     *                 description:
     *                   type: string
     *                   example: "Great post!"
     *                 likes:
     *                   type: integer
     *                   example: 5
     *       404:
     *         description: Not Found
     */
    getComment = async (req:Request<{id: number}>, res:Response) => {

        const comment = await CommentService.getComment(req.params.id, this.pool)
        if(!comment){ 
            res.status(404).end()
            return 
        }        
        res.status(200).json(comment)
    }

    /**
     * @openapi
     * /comment/{id}:
     *   delete:
     *     tags:
     *       - Comment
     *     summary: Delete a comment
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Comment ID
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: OK
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal Server Error
     */
    deleteComment = async (req:Request<{id: number}>, res:Response) => {
        // TODO: Check if the user how delete is the same how created the comment or the on how make the original post

        if (!await CommentService.getComment(req.params.id, this.pool)){
            res.status(400).end()
            return 
        }
        const answer = await CommentService.deleteComment(req.params.id, this.pool)

        if (answer){
            res.status(200).end()
            return 
        }
        res.status(500).end() 
        return 
    }



    buildRouter = (): Router => {
        const router = express.Router()
        router.get(`/:id`,this.getComment.bind(this))
        router.delete(`/:id`, this.deleteComment.bind(this))
        return router
    }

}