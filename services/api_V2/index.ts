import * as express from 'express'
import * as mongoose from 'mongoose'
import * as morgan from "morgan"

import { Response, Request } from "express"
import listEndpoints = require('express-list-endpoints')
import { AuthController, UserController } from './controller'
import { StartService } from './service'
import { TreeController } from './controller/tree.controller'

const startServer = async (): Promise<void> => {

    const connection = await mongoose.connect(process.env.MONGODB_URI as string, {auth: {
            username: process.env.MANGODB_USER as string,
            password: process.env.MANGODB_PASSWORD as string
        },
        authSource: "admin"
    })

    await StartService.userRoles()

    const app = express()

    app.use(morgan("short"))

    app.get("/", (req:Request, res:Response) => {
        res.send('Server V2 up')
    })

    const userController = new UserController()
    const authController = new AuthController() 
    const treeController = new TreeController()

    app.use(userController.path, userController.buildRouter())
    app.use(authController.path, authController.buildRouter())
    app.use(treeController.path, treeController.buildRouter())

    app.listen(process.env.PORT, () => {
        console.log(`Server up on PORT : ${process.env.PORT}`)
    })

    console.table(listEndpoints(app))

}
startServer().catch((err) => {
    console.error(err)
})
