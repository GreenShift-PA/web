import * as express from "express"

import { Document, Model } from "mongoose"
import { Todo, TodoModel } from "../models/todo.model"
import { Router, Request, Response } from "express"
import { checkBody, checkUserRole, checkUserToken } from "../middleware"
import { AdminTodo, AdminTodoModel, PostModel, SubtaskModel, Tree, TreeModel, User, UserModel } from "../models"
import { checkQuery } from "../middleware/query.middleware"
import { RolesEnums } from "../enums"

export class AdminTodoController {

    readonly path: string
    readonly model: Model<AdminTodo>

    constructor() {
        this.path = "/todo/admin"
        this.model = AdminTodoModel
    }

    readonly paramsCreateTask = {
        "title": "string",
        "description": "string",
        "deadline": "string",
        "difficulty" : "number"
    }

    createTask = async (req: Request, res: Response): Promise<void> => {

        let diff:number = req.body.difficulty
        if(req.body.difficulty < 0){diff = 0}
        if(req.body.difficulty > 3){diff = 3}

        const newTask = await AdminTodoModel.create({
            title: req.body.title,
            description: req.body.description,
            deadline: req.body.deadline,
            difficulty: diff
        })

        res.status(201).json(newTask)
        return
    }

    readonly queryDeleteTask = {
        "todo_id": "string"
    }
    
    deleteTask = async (req:Request, res:Response): Promise<void> => {

        try{
            await AdminTodoModel.findByIdAndDelete(req.query.todo_id)

            res.status(200).json({"message" : "OK"})
            return 

        }catch(e){
            res.status(403).json({"message": "This is not a good Id"})
            return 
        }

    }

    readonly paramsUpdateAdminTask = {
        "todo_id": "string",
        "title": "string | undefined",
        "description": "string | undefined",
        "deadline": "string | undefined",
        "difficulty" : "number | undefined"
    }

    updateAdminTask = async (req:Request, res:Response): Promise<void> => {

        let diff:number = req.body.difficulty
        if(req.body.difficulty < 0){diff = 0}
        if(req.body.difficulty > 3){diff = 3}


        try{
            const updated_todo_task = await AdminTodoModel.findByIdAndUpdate(req.body.todo_id, {
                title: req.body.title,
                description: req.body.description,
                deadline: req.body.deadline,
                difficulty: diff
            },
            { new: true })

            res.status(200).json(updated_todo_task)
            return 
        }catch(e){
            res.status(403).json({"message": "This is not a good Id"})
            return 
        }

    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.post('/', express.json(), checkUserToken(), checkUserRole(RolesEnums.admin), checkBody(this.paramsCreateTask), this.createTask.bind(this))
        router.patch('/', express.json(), checkUserToken(), checkUserRole(RolesEnums.admin), checkBody(this.paramsUpdateAdminTask), this.updateAdminTask.bind(this))
        router.delete("/", checkUserToken(), checkUserRole(RolesEnums.admin), checkQuery(this.queryDeleteTask) ,this.deleteTask.bind(this))
        return router
    }

}