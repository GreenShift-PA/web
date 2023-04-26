import * as dotenv from "dotenv"
dotenv.config()

import * as express from 'express'
import { UserController } from "./controller/user.controller"
const mysql = require('mysql2');

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
}).promise()

const app = express()

app.get("/", (req, res) => {
    res.status(200).send("Server Up")
})

const userController = new UserController(pool)

// Route : /user/...
app.use(userController.path, userController.buildRouter())


app.listen(process.env.PORT, () => {
    console.log(`Server up => ${process.env.PORT}`);
})