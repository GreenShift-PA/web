import { Router, Response, Request } from "express"
import * as express from 'express'
import { UserService } from "../services/user.service"


export class MessageController {
    readonly path: string
    readonly pool: any

    constructor(pool:any){
        this.path = "/message"
        this.pool = pool
    }

    getAllConversations = async (req: Request<{ id: number}>, res: Response) => {
        // Return all user conversations 
        const [conv] =  await this.pool.query(
            `SELECT DISTINCT 
                CONCAT_WS('_', LEAST(Message.from_user_id, Message.to_user_id), GREATEST(Message.from_user_id, Message.to_user_id)) as conversation_id ,
                MAX(Message.date) AS last_message_date, 
                MAX(u1.name) as sender_name,
                MIN(u1.firstname) as sender_firstname,
                MIN(u2.name) as receiver_name,
                MAX(u2.firstname) as receiver_firstname
            FROM Message
            INNER JOIN User as u1 ON Message.from_user_id = u1.ID
            INNER JOIN User as u2 ON Message.to_user_id = u2.ID
            WHERE u1.ID = ?
            GROUP BY conversation_id
            ORDER BY last_message_date DESC`
        ,[req.params.id])
        if(conv.length === 0){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(conv)
    }

    getConversation = async (req:Request<{ idFrom: number, idTo: number}>, res:Response) => {
        // Returns the conversation between 2 users  
        const params = {
            user_id_1: req.params.idFrom, 
            user_id_2: req.params.idTo
        }
        // TODO: Changed parameter assignment to avoid injection 
        const [conv] =  await this.pool.query(
            `SELECT *
            FROM (
                SELECT 
                    Message.content,
                    u1.ID as sender_id,
                    CONCAT_WS(' ', u1.name, u1.firstname) as sender_fullname,
                    u2.ID as receiver_id,
                    CONCAT_WS(' ', u2.name, u2.firstname) as receiver_fullname,
                    Message.date
                FROM Message 
                INNER JOIN User as u1 ON Message.from_user_id = u1.id
                INNER JOIN User as u2 ON Message.to_user_id = u2.id
                WHERE (Message.from_user_id = ${req.params.idFrom} AND Message.to_user_id = ${req.params.idTo}) 
                OR (Message.from_user_id = ${req.params.idTo} AND Message.to_user_id = ${req.params.idFrom})
                ORDER BY Message.date DESC
                LIMIT 15 OFFSET 0
            ) subquery
            ORDER BY subquery.date DESC;`)
        if(conv.length === 0){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(conv)
    }

    sendMessage = async (req:Request, res:Response) => {
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
            // If users existe
            res.status(400).end()
            return
        }

        await this.pool.query(`
        INSERT INTO Message (
            from_user_id, 
            to_user_id, 
            content 
        ) VALUES (
            ?, ?, ?)
        `, [req.body.from, req.body.to, req.body.content])
        res.status(200).end("ok")

    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/:id/', this.getAllConversations.bind(this))
        router.get('/:idFrom/:idTo', this.getConversation.bind(this))
        router.post('/', express.json(), this.sendMessage.bind(this))
        return router
    }
}