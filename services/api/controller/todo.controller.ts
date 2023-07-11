import * as express from "express"

import { Model } from "mongoose"
import { Todo, TodoModel } from "../models/todo.model"
import { Router, Request, Response } from "express"
import { checkBody, checkUserToken } from "../middleware"

export class TodoController {

    readonly path: string
    readonly model: Model<Todo>

    constructor(){
        this.path = "/todo"
        this.model = TodoModel
    }

    createTask = async (req:Request, res:Response): Promise<void> => {
        res.status(501).json({"message": "This feature is not ready come back later."})
        return
    }

    updateStatusTask = async (req:Request, res:Response): Promise<void> => {
        res.status(501).json({"message": "This feature is not ready come back later."})
        return
    }

    createSubtask = async (req:Request, res:Response): Promise<void> => {
        res.status(501).json({"message": "This feature is not ready come back later."})
        return
    }

    updateStatusSubtask = async (req:Request, res:Response): Promise<void> => {
        res.status(501).json({"message": "This feature is not ready come back later."})
        return
    }

    deleteTask = async (req:Request, res:Response): Promise<void> => {
        res.status(501).json({"message": "This feature is not ready come back later."})
        return
    }

    getTask = async (req:Request, res:Response): Promise<void> => {
        // Get your tasks 
        res.status(501).json({"message": "This feature is not ready come back later."})
        return
    }

    getSubtask = async (req:Request, res:Response): Promise<void> => {
        // Get the subtasks only of a task
        res.status(501).json({"message": "This feature is not ready come back later."})
        return
    }

    getAllTask = async (req:Request, res:Response): Promise<void> => {
        res.status(501).json({"message": "This feature is not ready come back later."})
        return
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', checkUserToken(), this.getTask.bind(this))
        router.get('/all', checkUserToken(), this.getAllTask.bind(this))
        router.get('/subtask', checkUserToken(), this.getSubtask.bind(this))
        router.post('/', express.json, checkUserToken(), this.createTask.bind(this))
        router.post('/subtask', express.json, checkUserToken(), this.createSubtask.bind(this))
        router.patch('/', express.json, checkUserToken(), this.updateStatusTask.bind(this))
        router.patch('/subtask', express.json, checkUserToken(), this.updateStatusSubtask.bind(this))
        router.delete('/', checkUserToken(), this.deleteTask.bind(this))
        return router
    }
}