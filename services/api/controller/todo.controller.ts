import * as express from "express"

import { Document, Model } from "mongoose"
import { Todo, TodoModel } from "../models/todo.model"
import { Router, Request, Response } from "express"
import { checkBody, checkUserToken } from "../middleware"
import { SubtaskModel, Tree, TreeModel, User, UserModel } from "../models"
import { checkQuery } from "../middleware/query.middleware"

export class TodoController {

    readonly path: string
    readonly model: Model<Todo>

    constructor() {
        this.path = "/todo"
        this.model = TodoModel
    }

    private addPoints = async (tree:string , score:number) => {

        const tree_info = await TreeModel.findById(tree)
        if (!tree_info){return}
        tree_info.size = tree_info.size + score
        tree_info.save()
    }

    ifYourtask = async (user_id: string, task_id: string): Promise<(Document<unknown, {}, Todo> & Omit<Todo & Required<{ _id: string; }>, never>) | boolean> => {
        // If the user and the task's author are the same 
        // Return the Todo object 
        // else Return false 
        try {

            const todo_task = await TodoModel.findById(task_id)
            const user = await UserModel.findById(user_id)

            if (!user || !todo_task) { return false }

            for (let user_task of user?.todoTask) {
                if (JSON.stringify(user_task) === JSON.stringify(todo_task._id)) {
                    return todo_task
                }
            }
            return false

        } catch (e) {
            return false
        }
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

        const newTask = await TodoModel.create({
            isDone: false,
            title: req.body.title,
            description: req.body.description,
            deadline: req.body.deadline,
            subtask: [],
            isReview: false,
            difficulty: diff,
            creationDate: new Date
        })

        req.user?.todoTask.push(newTask)
        req.user?.save()

        res.status(201).json(newTask)
        return
    }

    readonly paramsSwitchStatusTask = {
        "todo_id" : "string",
        "isDone" : "boolean | undefined",
        "isReviewed" : "boolean | undefined"
    }

    switchStatusTask = async (req:Request, res:Response): Promise<void> => {
        
        if (!req.user) { res.status(500).end(); return }

        const todo_task = await this.ifYourtask(req.user._id, req.body.todo_id)

        if (!todo_task || typeof todo_task === "boolean") {
            res.status(401).json({ "message": "You can't do this" })
            return
        }

        if(todo_task.isDone === false && req.body.isDone === true){
            console.log("il passe par la")
            await this.addPoints(req.user.tree._id, (todo_task.difficulty + 1) * 2)
        }

        const updated_todo_task = await TodoModel.findByIdAndUpdate(todo_task._id, {
            isDone: req.body.isDone,
            isReview : req.body.isReviewed
        },
        { new: true })

        res.status(200).json(updated_todo_task)
        return

    }

    readonly paramsUpdateStatusTask = {
        "todo_id": "string",
        "isDone": "boolean | undefined",
        "title": "string | undefined",
        "description": "string | undefined",
        "deadline": "string | undefined",
    }

    updateStatusTask = async (req: Request, res: Response): Promise<void> => {

        if (!req.user) { res.status(500).end(); return }

        const todo_task = await this.ifYourtask(req.user._id, req.body.todo_id)

        if (!todo_task || typeof todo_task === "boolean") {
            res.status(401).json({ "message": "You can't do this" })
            return
        }

        if(todo_task.isDone === false && req.body.isDone === true){
            console.log("il passe par la")
            await this.addPoints(req.user.tree._id, (todo_task.difficulty + 1) * 2)
        }

        const updated_todo_task = await TodoModel.findByIdAndUpdate(todo_task._id, {
            isDone: req.body.isDone,
            title: req.body.title,
            description: req.body.description,
            deadline: req.body.deadline,
        },
            { new: true })


        res.status(200).json(updated_todo_task)
        return
    }

    readonly paramsCreateSubtask = {
        "todo_id": "string",
        "title": "string",
        "description": "string",
    }

    createSubtask = async (req: Request, res: Response): Promise<void> => {

        if (!req.user) { res.status(500).end(); return }

        const todo_task = await this.ifYourtask(req.user._id, req.body.todo_id)

        if (!todo_task || typeof todo_task === "boolean") {
            res.status(401).json({ "message": "You can't do this" })
            return
        }

        const new_subtask = await SubtaskModel.create({
            isDone: false,
            title: req.body.title,
            description: req.body.description,
        })

        todo_task.subtask.push(new_subtask)
        todo_task.save()

        res.status(201).json(new_subtask)
        return
    }

    readonly paramsUpdateStatusSubtask = {
        "subtask_id": "string",
        "isDone": "boolean | undefined",
        "title": "string | undefined",
        "description": "string | undefined",
    }

    updateStatusSubtask = async (req: Request, res: Response): Promise<void> => {

        try {
            const updated_todo_task = await SubtaskModel.findByIdAndUpdate(req.body.subtask_id, {
                isDone: req.body.isDone,
                title: req.body.title,
                description: req.body.description,
                deadline: req.body.deadline,
            },
                { new: true })

            if (!updated_todo_task) {
                res.status(404).end()
                return
            }

            res.status(200).json(updated_todo_task)
            return
        } catch (e) {
            res.status(401).json({ "message": "Not a good Id" })
            return
        }
    }

    readonly queryDeleteTask = {
        "todo_id": "string"
    }

    deleteTask = async (req: Request, res: Response): Promise<void> => {

        if (!req.user || typeof req.query.todo_id !== "string") { res.status(500).end(); return }

        const todo_task = await this.ifYourtask(req.user._id, req.query.todo_id)

        if (typeof todo_task === "boolean") {
            res.status(401).json({ "message": "You can't do this" })
            return
        }

        await TodoModel.findByIdAndDelete(req.query.todo_id)

        res.status(200).json({ "message": "The todo task is deleted." })
        return
    }

    readonly queryGetOneTask = {
        "todo_id": "string | undefined"
    }

    getTask = async (req: Request, res: Response): Promise<void> => {
        // Get your tasks 

        // If the task is not specified, return all 
        if (!req.query.todo_id) {
            res.status(200).json(((await req.user?.populate("todoTask"))?.todoTask))
            return
        }

        // If not return the task
        if (!req.user || typeof req.query.todo_id !== "string") { res.status(500).end(); return }

        const todo_task = await this.ifYourtask(req.user._id, req.query.todo_id)

        if (typeof todo_task === "boolean") {
            res.status(401).json({ "message": "You can't do this" })
            return
        }

        res.status(200).json(await todo_task.populate("subtask"))
        return

    }

    readonly queryGetSubtask = {
        "todo_id": "string"
    }

    getSubtask = async (req: Request, res: Response): Promise<void> => {
        // Get the subtasks only of a task
        if (!req.user || typeof req.query.todo_id !== "string") { res.status(500).json({ "message": "This error should not be learned." }); return }

        const todo_task = await this.ifYourtask(req.user._id, req.query.todo_id)

        if (typeof todo_task === "boolean") {
            res.status(401).json({ "message": "You can't do this" })
            return
        }

        await todo_task.populate("subtask")

        res.status(200).json(todo_task?.subtask)
        return
    }


    buildRouter = (): Router => {
        const router = express.Router()
        router.get('/', checkUserToken(), checkQuery(this.queryGetOneTask), this.getTask.bind(this))
        router.get('/subtask', checkUserToken(), checkQuery(this.queryGetSubtask), this.getSubtask.bind(this))
        router.post('/', express.json(), checkUserToken(), checkBody(this.paramsCreateTask), this.createTask.bind(this))
        router.post('/subtask', express.json(), checkUserToken(), checkBody(this.paramsCreateSubtask), this.createSubtask.bind(this))
        router.patch('/', express.json(), checkUserToken(), checkBody(this.paramsUpdateStatusTask), this.updateStatusTask.bind(this))
        router.patch('/subtask', express.json(), checkUserToken(), checkBody(this.paramsUpdateStatusSubtask), this.updateStatusSubtask.bind(this))
        router.patch('/status', express.json(), checkUserToken(), checkBody(this.paramsSwitchStatusTask), this.switchStatusTask.bind(this))
        router.delete('/', checkUserToken(), checkQuery(this.queryDeleteTask), this.deleteTask.bind(this))
        return router
    }
}