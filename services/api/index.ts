import * as dotenv from "dotenv"
dotenv.config()

import * as express from 'express'
import {getUsers} from './database/user.database'

const app = express()

app.get("/", (req, res) => {
    res.status(200).send("Server Up")
})

app.get('/users', async (req, res) => {
    const users = await getUsers()
    res.send(users)
})

app.listen(process.env.PORT, () => {
    console.log("Server up");
})