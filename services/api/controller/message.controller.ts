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
            // If users existe
            res.status(400).end()
            return
        }

        if (req.body.from === req.body.to){
            res.status(406).end()
            return 
        }

        if (!await UserService.isUser(req.body.from, this.pool) || !await UserService.isUser(req.body.to, this.pool)){
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