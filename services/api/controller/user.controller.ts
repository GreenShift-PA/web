import { Router, Response, Request } from "express"
import * as express from 'express'
import { UserService } from "../services/user.service"


export class UserController {

    readonly path: string
    readonly pool: any

    constructor(pool:any){
        this.path = "/user"
        this.pool = pool
    }

    getAll = async (req:Request, res: Response)=> {
        const [users] = await this.pool.query('SELECT * FROM User')
        if(users.length === 0){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(users)
    }

    searchUser = async (req: Request<{ id: number}>, res: Response) => {
        const user = await UserService.getUser(req.params.id, this.pool)
        if(!user){ 
            res.status(404).end()
            return 
        }
        res.status(200).json(user)
    }

    deleteUser = async (req:Request<{ id: number}>, res: Response) => {
        const [user] =  await this.pool.query("DELETE FROM User WHERE ID = ? ", [req.params.id])
        if (user.affectedRows < 0){
            res.status(202).send("ok")
        }
        res.status(404).end()
        return 
    }

    createUser = async (req:Request, res: Response) => {
        if (!req.body || !req.body.name || !req.body.firstname || !req.body.email || !req.body.phone || !req.body.country){
            // If there is not all the parameters
            res.status(400).end()
            return 
        }
        if(typeof req.body.name !== 'string' || typeof req.body.firstname !== 'string' || typeof req.body.email !== 'string' || typeof req.body.phone !== 'string' || typeof req.body.country !== 'string'){
            // If the types are not the correct one
            res.status(400).end()
            return
        }
        const [user] =  await this.pool.query(`
        INSERT INTO User (
            name, 
            firstname, 
            email, 
            phone, 
            country
        ) VALUES (
            ?, ?, ?, ?, ?)
        `, [req.body.name, req.body.firstname, req.body.email, req.body.phone, req.body.country])
        res.status(200).end("ok")
    }

    buildRouter = (): Router => {
        const router = express.Router()
        router.get(`/`, this.getAll.bind(this))
        router.get(`/:id`, this.searchUser.bind(this))
        router.delete(`/:id`, this.deleteUser.bind(this))
        router.post(`/`,express.json(), this.createUser.bind(this))
        return router
    }
}