import { Router, Response, Request } from "express"
import * as express from 'express'
import { UserService } from "../services/user.service"
import { MessageService } from "../services/message.service"


export class MessageController {
    readonly path: string
    readonly pool: any

    constructor(pool:any){
        this.path = "/message"
        this.pool = pool
    }

    /**
 * @openapi
 * /message/{id}:
 *   get:
 *     tags:
 *       - Message
 *     summary: Have a list of all conversations of a user
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
 *                   conversation_id:
 *                     type: integer
 *                     example: 1
 *                   last_message_date:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-05-05T12:30:00Z"
 *                   sender_id:
 *                     type: integer
 *                     example: 2
 *                   sender_fullname:
 *                     type: string
 *                     example: "John Doe"
 *                   receiver_id:
 *                     type: integer
 *                     example: 3
 *                   receiver_fullname:
 *                     type: string
 *                     example: "Jane Smith"
 *             example: 
 *              - conversation_id: "3_4"
 *                last_message_date: '2023-05-04T17:05:11.000Z'
 *                sender_id: 3
 *                sender_fullname: Cristian URSU
 *                receiver_id: 4
 *                receiver_fullname: Lulu BUBU
 *              - conversation_id: "5_6"
 *                last_message_date: '2023-05-03T14:53:39.000Z'  
 *                sender_id: 5
 *                sender_fullname: Tata Gia
 *                receiver_id: 6
 *                receiver_fullname: Baba DID
 *       406:
 *         description: Not Acceptable
 *       404:
 *         description: Not Found
 */

    getAllConversations = async (req: Request<{ id: number}>, res: Response) => {
        // Checks if the user exists 
        if (!await UserService.isUser(req.params.id, this.pool)){
            res.status(406).end()
            return 
        }
        // Returns a list of all the user's contacts 
        const conv = await MessageService.getAllConversations(req.params.id, this.pool)
        if(!conv){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(conv)
    }

    /**
     * @openapi
     * /message/{idFrom}/{idTo}:
     *   get:
     *     tags:
     *       - Message
     *     summary: Get conversation between two users
     *     parameters:
     *       - in: path
     *         name: idFrom
     *         required: true
     *         description: Sender's user ID
     *         schema:
     *           type: integer
     *       - in: path
     *         name: idTo
     *         required: true
     *         description: Receiver's user ID
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
     *                   content:
     *                     type: string
     *                     example: "Hello, how are you?"
     *                   sender_id:
     *                     type: integer
     *                     example: 1
     *                   sender_fullname:
     *                     type: string
     *                     example: "John Doe"
     *                   receiver_id:
     *                     type: integer
     *                     example: 2
     *                   receiver_fullname:
     *                     type: string
     *                     example: "Jane Smith"
     *                   date:
     *                     type: string
     *                     example: "2023-05-05T10:30:00.000Z"
     *             example: 
     *              - content: "Hello, how are you?"
     *                sender_id: 4
     *                sender_fullname: Cristian URSU
     *                receiver_id: 3
     *                receiver_fullname: John Doe
     *                date: '2023-05-04T17:05:11.000Z'
     *              - content: "Good and you ?"
     *                sender_id: 4
     *                sender_fullname: John Doe
     *                receiver_id: 3
     *                receiver_fullname: Cristian URSU
     *                date: '2023-05-03T14:53:39.000Z'    
     *       400:
     *         description: Bad request
     *       406:
     *         description: Not Acceptable
     *       500:
     *         description: Internal Server Error
     */
    getConversation = async (req:Request<{ idFrom: number, idTo: number}>, res:Response) => {
        if (req.params.idFrom === req.params.idTo){
            res.status(406).end()
            return 
        }

        if (!await UserService.isUser(req.params.idFrom, this.pool) || !await UserService.isUser(req.params.idTo, this.pool)){
            res.status(406).end()
            return 
        }
        

        // Returns the conversation between 2 users  
        const conv = await MessageService.getConversation(req.params.idFrom,req.params.idTo, this.pool)
        if(!conv){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(conv)
    }

    /**
     * @openapi
     * /message/:
     *   post:
     *     tags:
     *       - Message
     *     summary: Send a message from one user to another
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               from:
     *                 type: number
     *                 description: ID of the user sending the message
     *               to:
     *                 type: number
     *                 description: ID of the user receiving the message
     *               content:
     *                 type: string
     *                 description: Content of the message
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: ok
     *       400:
     *         description: Bad request
     *       406:
     *         description: Not Acceptable
     *       500:
     *         description: Internal Server Error
     */
    sendMessage = async (req:Request, res:Response)=> {
        if (!req.body || !req.body.from || !req.body.to || !req.body.content){
            // If there is not all the parameters
            res.status(400).end()
            return 
        }
        if(typeof req.body.from !== 'number' || typeof req.body.to !== 'number' || typeof req.body.content !== 'string' ){
            // If the types are not the correct one
            res.status(400).end()
            return
        }
        if (!await UserService.isUser(req.body.from, this.pool) ||  !await UserService.isUser(req.body.to, this.pool)){
            // If users do not existe
            res.status(400).end()
            return
        }

        if (req.body.from === req.body.to){
            res.status(406).end()
            return 
        }

        const answer = await MessageService.sendMessage(req.body.from, req.body.to, req.body.content, this.pool)
        if(!answer){
            res.status(500).end()
            return 
        }
        res.status(200).send("ok")
        return 

    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/:id/', this.getAllConversations.bind(this))
        router.get('/:idFrom/:idTo', this.getConversation.bind(this))
        router.post('/', express.json(), this.sendMessage.bind(this))
        return router
    }
}