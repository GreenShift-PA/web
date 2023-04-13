import * as express from 'express'
import * as mysql from "mysql2";
import * as dotenv from "dotenv";
dotenv.config();

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connected to database !");
})

const app = express()

app.get("/", (req, res) => {
    res.status(200).send('Server up')
})

app.listen("3000", () => {
    console.log("Server up");
})