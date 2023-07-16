import * as express from "express"

import { Document, Model } from "mongoose"
import { Todo, TodoModel } from "../models/todo.model"
import { Router, Request, Response } from "express"
import { checkBody, checkUserToken } from "../middleware"
import { AdminTodo, AdminTodoModel, PostModel, SubtaskModel, Tree, TreeModel, User, UserModel } from "../models"
import { checkQuery } from "../middleware/query.middleware"

export class TodoController {

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

    buildRouter = (): Router => {
        const router = express.Router()
        return router
    }

}