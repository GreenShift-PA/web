import { Model } from "mongoose"
import { Message, MessageModel, UserModel } from "../models"

import * as express from "express"
import { Router, Response, Request } from "express"
import { checkBody, checkUserToken } from "../middleware"
import { checkQuery } from "../middleware/query.middleware"

export class MessageController {

    readonly path: string
    readonly model: Model<Message>

    constructor(){
        this.path = "/message"
        this.model = MessageModel
    }

    readonly paramsSendMessage = {
        "to": "string",
        "message" : "string"
    }

    sendMessage = async (req: Request, res: Response): Promise<void> => {

        console.log(req.body.to, req.user?._id);
        if ( !req.user || req.user._id == req.body.to){
            res.status(400).json({"message": "You can't send a message to yourself"})
            return 
        }

        let recipient

        try{
            recipient = await UserModel.findById(req.body.to)
        }catch(err){
            res.status(400).json({"message" : "The recipient is not an Id"})
            return 
        }

        if(!recipient){
            res.status(404).json({"message" : "The user doesn't exist"})
            return 
        }

        const message = await MessageModel.create({
            from: req.user,
            to: recipient,
            message: req.body.message,
            date: new Date()
        })

        res.status(201).json(message)
        return 
    }

    readonly queryGetConv = {
        "contact" : "string"
    }

    getConversation = async (req: Request, res: Response): Promise<void> => {
        let contact

        try{
            contact = await UserModel.findById(req.query.contact)
            if(!contact){
                res.status(404).json({"message" : "User not found"})
            }
        }catch(err){
            res.status(400).json({"message": "This is not an user Id"})
            return 
        }

        try{
            const conversation = await MessageModel.find({$or:[
                {from: req.user, to:contact},
                {from: contact, to:req.user}
            ]})
            if(!contact){
                res.status(204).json({"message": "No conversation with this contact"})
                return 
            }
            res.status(200).json(conversation)
            return
        }catch(err){
            console.log(err)
            res.status(500).end()
            return 
        }
    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', checkUserToken(), checkQuery(this.queryGetConv), this.getConversation.bind(this))
        router.post('/', express.json(), checkUserToken(), checkBody(this.paramsSendMessage), this.sendMessage.bind(this))
        return router
    }
}