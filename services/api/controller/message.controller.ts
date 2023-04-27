import { Router, Response, Request } from "express"
import * as express from 'express'


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


    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/:id/', this.getAllConversations.bind(this))
        return router
    }
}