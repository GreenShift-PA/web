import * as express from 'express'
import * as mongoose from 'mongoose'
import * as morgan from "morgan"

import { Response, Request } from "express"
import listEndpoints = require('express-list-endpoints')
import { AuthController, UserController } from './controller'
import { StartService } from './service'
import { TreeController } from './controller/tree.controller'
import { PostController } from './controller/post.controller'
import { MessageController } from './controller/message.controller'
import { TodoController } from './controller/todo.controller'
import { AdminTodoController } from './controller/adminTodo.controller'
const cors = require('cors');

const startServer = async (): Promise<void> => {

    const connection = await mongoose.connect(process.env.MONGODB_URI as string, {auth: {
            username: process.env.MANGODB_USER as string,
            password: process.env.MANGODB_PASSWORD as string
        },
        authSource: "admin"
    })


    await StartService.userRoles()
    
    const app = express()
    // Specify allowed origins explicitly
    const corsOptions = {
        origin: 'http://localhost:4200', // Update with your Angular application's URL
    };
    app.use(cors(corsOptions));
  

    app.use(morgan("short"))
    app.get('/', (req, res) => {
        const response = { message: 'Server is up' };
        res.json(response);
      });
      
    
    const userController = new UserController()
    const authController = new AuthController() 
    const treeController = new TreeController()
    const postController = new PostController()
    const messageController = new MessageController()
    const todoController = new TodoController()
    const adminTodoController = new AdminTodoController()
    
    // This call to the function is out of place because if we put StartService.createUsers() after StartService.userRoles(), 
    //      then the creation doesn't work because the program is trying to create a user while the creation role is not finished.
    await StartService.createUsers()

    app.use(userController.path, userController.buildRouter())
    app.use(authController.path, authController.buildRouter())
    app.use(treeController.path, treeController.buildRouter())
    app.use(postController.path, postController.buildRouter())
    app.use(messageController.path, messageController.buildRouter())
    app.use(todoController.path, todoController.buildRouter())
    app.use(adminTodoController.path, adminTodoController.buildRouter())

    app.listen(process.env.PORT, () => {
        console.log(`Server up on PORT : ${process.env.PORT}`)
    })

    console.table(listEndpoints(app))

}
startServer().catch((err) => {
    console.error(err)
})
